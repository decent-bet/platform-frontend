import IKeyHandler from 'src/common/helpers/IKeyHandler'
import actions from './actions'
import { units } from 'ethereum-units'
let subscriptions: any[] = []

interface IDependencies {
    keyHandler: IKeyHandler
}

export function getCasinoLoginStatus() {
    return async (dispatch, _getState, { keyHandler }: IDependencies) => {
        return await dispatch(actions.getCasinoLoginStatus(keyHandler))
    }
}

export function authWallet(data: string) {
    return async (dispatch, __getState, { keyHandler }: IDependencies) => {
        await dispatch(actions.authWallet(data, keyHandler))
    }
}

export function setupChainProvider() {
    return async (dispatch, _getState, { chainProvider }) => {
        await chainProvider.setupThorify()
    }
}

export function initializeSlots() {
    return async (dispatch, _getState, { chainProvider, helper }) => {
        await dispatch(actions.getBalance(chainProvider, helper))
        await dispatch(actions.getAllowance(chainProvider, helper))
    }
}

export function spin(totalBetSize, props, listener) {
    return async (_dispatch, _getState, { slotsChannelHandler }) => {
        await slotsChannelHandler.spin(totalBetSize, props, listener)
    }
}

export function fetchChannels() {
    return async (
        dispatch,
        _getState,
        { chainProvider, httpApi, helper, utils }
    ) => {
        return await dispatch(
            actions.getChannels(chainProvider, httpApi, helper, utils)
        )
    }
}

export function fetchChannel(channelId) {
    return async (
        dispatch,
        _getState,
        { chainProvider, httpApi, helper, utils }
    ) => {
        let { contractFactory } = chainProvider
        await dispatch(
            actions.getChannelDetails(channelId, contractFactory, helper)
        )
        await dispatch(
            actions.getLastSpin(
                channelId,
                chainProvider,
                httpApi,
                helper,
                utils
            )
        )
    }
}

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise}
 */
export function claimAndWithdrawFromChannel(channelId) {
    return async (
        dispatch,
        _getState,
        { chainProvider, helper, keyHandler }
    ) => {
        let { contractFactory } = chainProvider
        let contract = await contractFactory.slotsChannelManagerContract()
        // Claim the channel, check token total in the contract, and withdraw tokens
        console.log('claimAndWithdrawFromChannel', channelId)
        await dispatch(actions.claimChannel(channelId, contract, helper))
        const tokensInContract = await dispatch(
            actions.getBalance(chainProvider, channelId)
        )
        console.log('claimAndWithdrawFromChannel', { tokensInContract })

        if (tokensInContract)
            await dispatch(
                actions.withdrawChips(tokensInContract.value, contract, helper)
            )
    }
}

/**
 * Builds a State Channel in a single step
 * @param {BigNumber} amount
 * @param {BigNumber} allowance
 * @param balance
 * @param statusUpdateListener
 * @returns {Promise<string>}
 */
export function buildChannel(amount, allowance, balance, statusUpdateListener) {
    return async (dispatch, _getState, { chainProvider, helper }) => {
        // Approve Tokens if it needs more allowance
        let { contractFactory } = chainProvider

        if (balance.isLessThan(amount)) {
            let depositAmount = balance.isGreaterThan(0)
                ? amount.minus(balance)
                : amount

            let formattedDepositAmount = depositAmount
                .dividedBy(units.ether)
                .toFixed()

            if (allowance.isLessThan(depositAmount)) {
                statusUpdateListener(
                    `Approving ${formattedDepositAmount} DBETs for token deposit`
                )
                await dispatch(
                    actions.approve(depositAmount, chainProvider, helper)
                )
            }

            statusUpdateListener(
                `Depositing ${formattedDepositAmount} DBETs into slots contract`
            )
            await dispatch(
                actions.depositChips(depositAmount, chainProvider, helper)
            )
        }

        // Create Channel
        statusUpdateListener(`Sending create channel transaction`)
        const channelTransaction = await dispatch(
            actions.createChannel(amount, contractFactory, helper)
        )
        if (channelTransaction && channelTransaction.value) {
            const channelId = channelTransaction.value

            await dispatch(
                depositIntoCreatedChannel(channelId, statusUpdateListener)
            )
            return channelId
        } else return 0
    }
}

export function depositIntoCreatedChannel(id, statusUpdateListener) {
    return async (
        dispatch,
        _getState,
        { chainProvider, httpApi, helper, utils, keyHandler }
    ) => {
        const { contractFactory } = chainProvider
        // Deposit Tokens to channel
        statusUpdateListener(`Depositing DBETs into created channel`)
        const channelDepositTransaction = await dispatch(
            actions.depositToChannel(id, contractFactory, helper, utils)
        )

        statusUpdateListener(`Waiting for house to activate channel`)
        await dispatch(
            actions.waitForChannelActivation(
                id,
                channelDepositTransaction.value,
                contractFactory,
                helper
            )
        )

        // Query the channel's data and add it to the redux state
        await dispatch(
            actions.getChannel(id, chainProvider, httpApi, helper, utils)
        )

        // Update the ether balance
        // await dispatch(dashboardactions.getEtherBalance(chainProvider, helper, keyHandler))
        return id
    }
}

/**
 * Spin the slots, wait for the action to complete, AND THEN increase the nonce.
 * @param {string} channelId
 * @param {string} msg
 */
export function spinAndIncreaseNonce(channelId, msg) {
    return async dispatch => {
        await dispatch(actions.postSpin(channelId, msg))
        await dispatch(actions.nonceIncrease(channelId))
    }
}

export function initializeGame(channelId) {
    return async (
        dispatch,
        _getState,
        { chainProvider, httpApi, helper, utils }
    ) => {
        let { contractFactory } = chainProvider

        await dispatch(actions.getAesKey(channelId, utils))
        await dispatch(
            actions.getChannelDetails(channelId, contractFactory, helper)
        )
        await dispatch(
            actions.getLastSpin(
                channelId,
                chainProvider,
                httpApi,
                helper,
                utils
            )
        )
        await dispatch(watcherChannelFinalized(channelId))
        await dispatch(watcherChannelClaimed(channelId))
    }
}

export function finalizeChannel(channelId, state) {
    return async (dispatch, _getState, injectedDependencies) => {
        await dispatch(
            actions.finalizeChannel(channelId, state, injectedDependencies)
        )
    }
}

// Watcher that monitors channel finalization
export function watcherChannelFinalized(channelId) {
    return async (dispatch, _getState, { chainProvider }) => {
        try {
            let { contractFactory } = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()
            const finalizedChannelEventSubscription = await contract.getEventSubscription(
                contract.logChannelFinalized(channelId)
            )

            const finalizedChannelSubscription = finalizedChannelEventSubscription.subscribe(
                async events => {
                    if (events && events.length) {
                        let [event] = events
                        let id = event.returnValues.id.toString()
                        await dispatch(actions.setChannelFinalized(id))
                        finalizedChannelSubscription.unsubscribe()
                    }
                }
            )
            return
        } catch (error) {
            console.error('Finalized channel event', error)
            return
        }
    }
}

export function initializeCasino() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        await dispatch(actions.getTokens(contractFactory, keyHandler))
        await dispatch(actions.getEtherBalance(contractFactory, keyHandler))
    }
}

export function watcherChannelClaimed(channelId) {
    return async (dispatch, _getState, { contractFactory }) => {
        const contract = await contractFactory.slotsChannelManagerContract()
        const subscription = contract.logClaimChannelTokens(channelId)
        const claimChannelEventSubscription = contract.getEventSubscription(
            subscription
        )

        const claimChannelSubscription = claimChannelEventSubscription.subscribe(
            async events => {
                if (events && events.length >= 1) {
                    let [event] = events
                    let id = event.returnValues.id.toString()
                    await dispatch(
                        actions.setChannelClaimed(
                            id,
                            event.returnValues.isHouse
                        )
                    )
                    claimChannelSubscription.unsubscribe()
                }
            }
        )
        return
    }
}

export function listenForTransfers() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        // clear any previous transfer subscriptions
        listenForTransfers_unsubscribe()

        let tokenContract = await contractFactory.decentBetTokenContract()
        const defaultAccount = keyHandler.getPublicAddress()
        const transferFromEventsSubscription = tokenContract.getEventSubscription(
            tokenContract.logTransfer(defaultAccount, true),
            5000
        )
        const transferToEventsSubscription = tokenContract.getEventSubscription(
            tokenContract.logTransfer(defaultAccount, false),
            5000
        )

        const fromSubscription = transferFromEventsSubscription.subscribe(
            async events => {
                if (events.length >= 1) {
                    await dispatch(
                        actions.getTokens(contractFactory, keyHandler)
                    )
                    await dispatch(
                        actions.getEtherBalance(contractFactory, keyHandler)
                    )
                }
            }
        )
        subscriptions.push(fromSubscription)

        const toSubscription = transferToEventsSubscription.subscribe(
            async events => {
                if (events.length >= 1) {
                    await dispatch(
                        actions.getTokens(contractFactory, keyHandler)
                    )
                    await dispatch(
                        actions.getEtherBalance(contractFactory, keyHandler)
                    )
                }
            }
        )

        subscriptions.push(toSubscription)

        return subscriptions
    }
}

export function listenForTransfers_unsubscribe() {
    subscriptions.forEach(sub => {
        sub.unsubscribe()
    })

    subscriptions = []
}

export function faucet() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        await dispatch(actions.faucet(contractFactory))
        await dispatch(actions.getTokens(contractFactory, keyHandler))
        await dispatch(actions.getEtherBalance(contractFactory, keyHandler))
    }
}
