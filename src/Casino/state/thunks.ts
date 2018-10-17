import actions from './actions'
let subscriptions: any[] = []
import { IThunkDependencies } from '../../common/types'
import { openAlert } from '../../common/state/thunks'

export function getCasinoLoginStatus() {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        return await dispatch(actions.getCasinoLoginStatus(keyHandler))
    }
}

export function authWallet(data: string, account: any) {
    return async (dispatch, __getState, { keyHandler }: IThunkDependencies) => {
        await dispatch(actions.authWallet(data, account, keyHandler))
        await dispatch(
            openAlert('You are enabled to play on the casino!', 'info')
        )
    }
}

export function initializeSlots() {
    return async (
        dispatch,
        _getState,
        { contractFactory, keyHandler }: IThunkDependencies
    ) => {
        const publicAddress = await keyHandler.getPublicAddress()
        await dispatch(actions.getBalance(contractFactory, publicAddress))
        await dispatch(actions.getAllowance(contractFactory, publicAddress))
    }
}

export function spin(totalBetSize, props, listener) {
    return (_dispatch, _getState, { slotsChannelHandler }) => {
        return new Promise(async (resolve, reject) => {
            try {
                await slotsChannelHandler.spin(totalBetSize, props, listener)
            } catch {
                reject('Error on SPIN')
            }
        })
    }
}

export function verifyHouseSpin(props, houseSpin, userSpin) {
    return async (_dispatch, _getState, { slotsChannelHandler }) => {
        await slotsChannelHandler.verifyHouseSpin(props, houseSpin, userSpin)
    }
}

export function subscribeToSpinResponses(listener) {
    return async (dispatch, _getState, { wsApi, slotsChannelHandler }) => {
        await dispatch(
            actions.subscribeToSpinResponses(
                listener,
                wsApi,
                slotsChannelHandler
            )
        )
    }
}

export function subscribeToFinalizeResponses(listener) {
    return async (dispatch, getState, { wsApi, slotsChannelHandler }) => {
        await dispatch(
            actions.subscribeToFinalizeResponses(
                listener,
                wsApi,
                slotsChannelHandler
            )
        )
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

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise}
 */
export function claimAndWithdrawFromChannel(channelId: string) {
    return async (
        dispatch,
        _getState,
        { contractFactory, keyHandler }: IThunkDependencies
    ) => {
        let contract = await contractFactory.slotsChannelManagerContract()
        // Claim the channel, check token total in the contract, and withdraw tokens

        await dispatch(actions.claimChannel(channelId, contract))
        const tokensInContract = await dispatch(
            actions.getBalance(contractFactory, channelId)
        )

        if (tokensInContract && tokensInContract.value)
            await dispatch(
                actions.withdrawChips(tokensInContract.value, contract)
            )

        // Update the balance
        await dispatch(actions.getTokens(contractFactory, keyHandler))
        await dispatch(actions.getEtherBalance(contractFactory, keyHandler))
    }
}

export function initChannel(amount, statusUpdateListener) {
    return async (
        dispatch,
        _getState,
        { contractFactory, wsApi, utils, keyHandler }
    ) => {
        statusUpdateListener(
            `Initializing channel with ${utils.formatEther(
                amount.toFixed()
            )} DBETs`
        )
        const initChannelRes = await dispatch(
            actions.initChannel(amount.toFixed(), contractFactory, utils, wsApi)
        )
        const id = initChannelRes.value
        statusUpdateListener(`Successfully initialized channel`)
        const channelNonceRes = await dispatch(
            actions.getChannelNonce(id, contractFactory)
        )
        const channelNonce = channelNonceRes.value

        // Query the channel's data and add it to the redux state
        await dispatch(
            actions.getChannel(id, channelNonce, contractFactory, wsApi, utils)
        )

        // Update the ether balance
        await dispatch(actions.getEtherBalance(contractFactory, keyHandler))

        return id
    }
}

export function depositIntoCreatedChannel(id, statusUpdateListener) {
    return async (
        dispatch,
        getState,
        { chainProvider, wsApi, helper, utils, keyHandler }
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
            actions.getChannel(id, chainProvider, wsApi, helper, utils)
        )

        // Update the ether balance
        await dispatch(
            actions.getEtherBalance(chainProvider, helper, keyHandler)
        )
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
    return async (dispatch, getState, { contractFactory, wsApi, utils }) => {
        const result = await dispatch(
            actions.getChannelNonce(channelId, contractFactory)
        )
        const channelNonce = result.value
        await dispatch(actions.getAesKey(channelId, channelNonce, utils))
        await dispatch(actions.getChannelDetails(channelId, contractFactory))
        await dispatch(
            actions.getLastSpin(
                channelId,
                channelNonce,
                contractFactory,
                wsApi,
                utils
            )
        )
        await dispatch(watcherChannelFinalized(channelId))
        await dispatch(watcherChannelClaimed(channelId))
    }
}

export function finalizeChannel(channelId, state) {
    return async (dispatch, getState, injectedDependencies) => {
        await dispatch(
            actions.finalizeChannel(channelId, state, injectedDependencies)
        )
    }
}

// Watcher that monitors channel finalization
export function watcherChannelFinalized(channelId) {
    return async (dispatch, getState, { chainProvider }) => {
        try {
            let { contractFactory } = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()
            const id = await contract.logChannelFinalized(channelId)
            return await dispatch(actions.setChannelFinalized(id))
        } catch (error) {
            console.error('Finalized channel event', error)
            return
        }
    }
}

// Watcher that monitors the claiming of a channel's Chips
export function watcherChannelClaimed(channelId) {
    return async (dispatch, getState, { contractFactory }) => {
        try {
            const contract = await contractFactory.slotsChannelManagerContract()
            const { id, isHouse } = await contract.logClaimChannelTokens(
                channelId
            )
            return await dispatch(actions.setChannelClaimed(id, isHouse))
        } catch (error) {
            console.error('Claim channel tokens event error', error)
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
