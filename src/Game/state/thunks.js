import Actions from './actions'
// import mainActions from '../../common/state/actions'
import { units } from 'ethereum-units'

export function getCurrentStage() {
    return async (dispatch, getState, { keyHandler }) => {
         return dispatch(Actions.getCurrentStage(keyHandler))
    }
}

export function setCurrentStage(stage) {
    return async (dispatch, _getState, { keyHandler } ) => {
        await dispatch(Actions.setCurrentStage(keyHandler, stage))
    }
}

export function authWallet(data) {
    return async (dispatch, _getState, { keyHandler } ) => {
        await dispatch(Actions.authWallet(data, keyHandler))
    }
}

export function setupChainProvider() {
    return async(dispatch, getState, { chainProvider }) => {
        await chainProvider.setupThorify()
    }
}

export function initializeSlots() {
    return async (dispatch, getState, {chainProvider, helper}) => {
        await dispatch(Actions.getBalance(chainProvider, helper))
        await dispatch(Actions.getAllowance(chainProvider, helper))
    }
}

export function spin(totalBetSize, props, listener) {
    return async (dispatch, getState, {slotsChannelHandler}) => {
        await slotsChannelHandler.spin(totalBetSize, props, listener)
    }
}

export function fetchChannels() {
    return async (dispatch, getState, {chainProvider, httpApi, helper, utils}) => {
        return await dispatch(Actions.getChannels(chainProvider, httpApi, helper, utils))
    }
}

export function fetchChannel(channelId) {
    return async (dispatch, getState, {chainProvider, httpApi, helper, utils}) => {
        let {contractFactory} = chainProvider
        await dispatch(Actions.getChannelDetails(channelId, contractFactory, helper))
        await dispatch(Actions.getLastSpin(channelId, chainProvider, httpApi, helper, utils))
    }
}

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise}
 */
export function claimAndWithdrawFromChannel(channelId) {
    return async (dispatch, getState, { chainProvider, helper, keyHandler }) => {
        let { contractFactory } = chainProvider
        let contract = await contractFactory.slotsChannelManagerContract()
        // Claim the channel, check token total in the contract, and withdraw tokens
        console.log('claimAndWithdrawFromChannel', channelId)
        await dispatch(Actions.claimChannel(channelId, contract, helper))
        const tokensInContract = await dispatch(
            Actions.getBalance(chainProvider, channelId)
        )
        console.log('claimAndWithdrawFromChannel', {tokensInContract})

        if (tokensInContract)
            await dispatch(Actions.withdrawChips(tokensInContract.value, contract, helper ))

        // Update the balance
        // await dispatch(mainActions.getTokens(chainProvider, helper, keyHandler))
        // await dispatch(mainActions.getEtherBalance(chainProvider, helper, keyHandler))
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
    return async (dispatch, getState, { chainProvider, helper }) => {
        // Approve Tokens if it needs more allowance
        let { contractFactory } = chainProvider

        if (balance.isLessThan(amount)) {
            let depositAmount = (balance.isGreaterThan(0)) ?
                amount.minus(balance) :
                amount

            let formattedDepositAmount =
                depositAmount.dividedBy(units.ether).toFixed()

            if (allowance.isLessThan(depositAmount)) {
                statusUpdateListener(`Approving ${formattedDepositAmount} DBETs for token deposit`)
                await dispatch(Actions.approve(depositAmount, chainProvider, helper))
            }

            statusUpdateListener(`Depositing ${formattedDepositAmount} DBETs into slots contract`)
            await dispatch(Actions.depositChips(depositAmount, chainProvider, helper ))
        }

        // Create Channel
        statusUpdateListener(`Sending create channel transaction`)
        const channelTransaction = await dispatch(
            Actions.createChannel(amount, contractFactory, helper )
        )
        if (channelTransaction && channelTransaction.value) {
            const channelId = channelTransaction.value
            
            await dispatch(depositIntoCreatedChannel(channelId, statusUpdateListener))
            return channelId
        } else
            return 0
    }
}

export function depositIntoCreatedChannel(id, statusUpdateListener) {
    return async (dispatch, getState, {chainProvider, httpApi, helper, utils, keyHandler}) => {
        
        const {contractFactory} = chainProvider
        // Deposit Tokens to channel
        statusUpdateListener(`Depositing DBETs into created channel`)
        const channelDepositTransaction = await dispatch(Actions.depositToChannel(id, contractFactory, helper, utils ))

        statusUpdateListener(`Waiting for house to activate channel`)
        await dispatch(Actions.waitForChannelActivation(id, channelDepositTransaction.value, contractFactory, helper ))

        // Query the channel's data and add it to the redux state
        await dispatch(Actions.getChannel(id, chainProvider, httpApi, helper, utils ))

        // Update the ether balance
        // await dispatch(dashboardActions.getEtherBalance(chainProvider, helper, keyHandler))
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
        await dispatch(Actions.postSpin(channelId, msg))
        await dispatch(Actions.nonceIncrease(channelId))
    }
}

export function initializeGame(channelId) {
    return async (dispatch, getState, { chainProvider, httpApi, helper, utils }) => {
        let { contractFactory } = chainProvider

        await dispatch(Actions.getAesKey(channelId, utils))
        await dispatch(Actions.getChannelDetails(channelId, contractFactory, helper))
        await dispatch(Actions.getLastSpin(channelId, chainProvider, httpApi, helper, utils))
        await dispatch(watcherChannelFinalized(channelId))
        await dispatch(watcherChannelClaimed(channelId))
    }
}

export function finalizeChannel(channelId, state) {
    return async (dispatch, getState, injectedDependencies) => {
        await dispatch(Actions.finalizeChannel(channelId, state, injectedDependencies))
    }
}

// Watcher that monitors channel finalization
export function watcherChannelFinalized(channelId) {
    return async (dispatch, getState, {chainProvider}) => {

        try {
            let {contractFactory} = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()
            const finalizedChannelEventSubscription =
                await contract.getEventSubscription(contract.logChannelFinalized(channelId))

            const finalizedChannelSubscription =
                finalizedChannelEventSubscription.subscribe(async (events) => {
                    if (events && events.length) {
                        let [event] = events
                        let id = event.returnValues.id.toString()
                        await dispatch(Actions.setChannelFinalized(id))
                        finalizedChannelSubscription.unsubscribe()
                    }
                })
            return
        } catch (error) {
            console.error('Finalized channel event', error)
            return
        }
    }
}

// Watcher that monitors the claiming of a channel's Chips
export function watcherChannelClaimed(channelId) {
    return async (dispatch, getState, {chainProvider}) => {
        try {
            const {contractFactory} = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()
            const subscription = contract.logClaimChannelTokens(channelId)
            const claimChannelEventSubscription = contract.getEventSubscription(subscription)

            const claimChannelSubscription =
                claimChannelEventSubscription.subscribe(async (events) => {
                    if (events && events.length >= 1) {
                        let [event] = events
                        let id = event.returnValues.id.toString()
                        await
                            dispatch(
                                Actions.setChannelClaimed(
                                    id,
                                    event.returnValues.isHouse
                                )
                            )
                        claimChannelSubscription.unsubscribe()
                    }
                })
            return
        } catch (error) {
            console.error('Claim channel tokens event error', error)
            return
        }
    }
}
