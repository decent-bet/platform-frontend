import Actions from './actions'
import { Actions as BalanceActions } from '../balance'
import { Thunks } from "./index"
import { units } from 'ethereum-units'


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

export function verifyHouseSpin(props, houseSpin, userSpin) {
    return async (dispatch, getState, {slotsChannelHandler}) => {
        await slotsChannelHandler.verifyHouseSpin(props, houseSpin, userSpin)
    }
}

export function subscribeToSpinResponses(listener) {
    return async (dispatch, getState, {wsApi, slotsChannelHandler}) => {
        await dispatch(Actions.subscribeToSpinResponses(listener, wsApi, slotsChannelHandler))
    }
}

export function subscribeToFinalizeResponses(listener) {
    return async (dispatch, getState, {wsApi, slotsChannelHandler}) => {
        await dispatch(Actions.subscribeToFinalizeResponses(listener, wsApi, slotsChannelHandler))
    }
}

export function fetchChannels() {
    return async (dispatch, getState, {chainProvider, wsApi, helper, utils}) => {
        return await dispatch(Actions.getChannels(chainProvider, wsApi, helper, utils))
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
        await dispatch(Actions.claimChannel(channelId, contract, helper))
        const tokensInContract = await dispatch(
            Actions.getBalance(chainProvider, channelId)
        )

        if (tokensInContract && tokensInContract.value)
            await dispatch(Actions.withdrawChips(tokensInContract.value, contract, helper ))

        // Update the balance
        await dispatch(BalanceActions.getTokens(chainProvider, helper, keyHandler))
        await dispatch(BalanceActions.getEtherBalance(chainProvider, helper, keyHandler))
    }
}

export function initChannel(amount, statusUpdateListener) {
    return async (dispatch, getState, {chainProvider, wsApi, helper, utils, keyHandler}) => {
        let { contractFactory } = chainProvider
        statusUpdateListener(`Initializing channel with ${helper.formatEther(amount.toFixed())} DBETs`)
        const initChannelRes = await dispatch(Actions.initChannel(amount.toFixed(), chainProvider, utils, wsApi))
        const id = initChannelRes.value
        statusUpdateListener(`Successfully initialized channel`)

        const channelNonceRes = await dispatch(Actions.getChannelNonce(id, contractFactory, helper))
        const channelNonce = channelNonceRes.value

        // Query the channel's data and add it to the redux state
        await dispatch(Actions.getChannel(id, channelNonce, chainProvider, wsApi, helper, utils ))

        // Update the ether balance
        await dispatch(BalanceActions.getEtherBalance(chainProvider, helper, keyHandler))

        return id
    }
}

export function depositIntoCreatedChannel(id, statusUpdateListener) {
    return async (dispatch, getState, {chainProvider, wsApi, helper, utils, keyHandler}) => {

        const {contractFactory} = chainProvider
        // Deposit Tokens to channel
        statusUpdateListener(`Depositing DBETs into created channel`)
        const channelDepositTransaction = await dispatch(Actions.depositToChannel(id, contractFactory, helper, utils ))

        statusUpdateListener(`Waiting for house to activate channel`)
        await dispatch(Actions.waitForChannelActivation(id, channelDepositTransaction.value, contractFactory, helper ))

        // Query the channel's data and add it to the redux state
        await dispatch(Actions.getChannel(id, chainProvider, wsApi, helper, utils ))

        // Update the ether balance
        await dispatch(BalanceActions.getEtherBalance(chainProvider, helper, keyHandler))
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
    return async (dispatch, getState, { chainProvider, wsApi, helper, utils }) => {
        let { contractFactory } = chainProvider
        const result = await dispatch(Actions.getChannelNonce(channelId, contractFactory, helper))
        const channelNonce = result.value
        await dispatch(Actions.getAesKey(channelId, channelNonce, utils))
        await dispatch(Actions.getChannelDetails(channelId, contractFactory, helper))
        await dispatch(Actions.getLastSpin(channelId, channelNonce, chainProvider, wsApi, helper, utils))
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
            const id = await contract.logChannelFinalized(channelId)
            return await dispatch(Actions.setChannelFinalized(id))
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
            const {id, isHouse} = await contract.logClaimChannelTokens(channelId)
            return await
                dispatch(
                    Actions.setChannelClaimed(
                        id,
                        isHouse
                    )
                )
        } catch (error) {
            console.error('Claim channel tokens event error', error)
            return
        }
    }
}
