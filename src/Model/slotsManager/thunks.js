import Actions from './actions'
import {Actions as BalanceActions} from '../balance'
import SlotsChannelHandler from './SlotsChannelHandler'
import {Thunks} from "./index";
import BigNumber from 'bignumber.js'
import { units } from 'ethereum-units'

let slotsChannelHandler = null

export function initializeSlots() {

    return async (dispatch, getState, {chainProvider}) => {
        await dispatch(Actions.getBalance(chainProvider))
        await dispatch(Actions.getAllowance(chainProvider))
    }
}

export function spin(totalBetSize, props, listener) {
    return async (dispatch, getState, {chainProvider}) => {

        if (!slotsChannelHandler) {
            slotsChannelHandler = new SlotsChannelHandler(chainProvider.web3)
        }

        await slotsChannelHandler.spin(totalBetSize, props, chainProvider, listener)
    }
}

export function fetchChannels() {
    return async (dispatch, getState, {chainProvider}) => {
        return await dispatch(Actions.getChannels(chainProvider))
    }
}

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise}
 */
export function claimAndWithdrawFromChannel(channelId) {
    return async (dispatch, getState, {chainProvider}) => {
        // Claim the channel, check token total in the contract, and withdraw tokens
        console.log('claimAndWithdrawFromChannel', channelId)
        await dispatch(Actions.claimChannel(channelId, chainProvider))
        const tokensInContract = await dispatch(
            Actions.getBalance(chainProvider, channelId)
        )
        console.log('claimAndWithdrawFromChannel', {tokensInContract})

        if (tokensInContract)
            await dispatch(Actions.withdrawChips(tokensInContract.value, chainProvider))

        // Update the ether balance
        await dispatch(BalanceActions.getTokens(chainProvider))
        await dispatch(BalanceActions.getEtherBalance(chainProvider))
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
    return async (dispatch, getState, {chainProvider}) => {
        // Approve Tokens if it needs more allowance
        if (balance.isLessThan(amount)) {
            let depositAmount = (balance.isGreaterThan(0)) ?
                amount.minus(balance) :
                amount

            let formattedDepositAmount =
                depositAmount.dividedBy(units.ether).toFixed()

            if (allowance.isLessThan(depositAmount)) {
                statusUpdateListener(`Approving ${formattedDepositAmount} DBETs for token deposit`)
                await dispatch(Actions.approve(depositAmount, chainProvider))
            }

            statusUpdateListener(`Depositing ${formattedDepositAmount} DBETs into slots contract`)
            await dispatch(Actions.depositChips(depositAmount, chainProvider))
        }

        // Create Channel
        statusUpdateListener(`Sending create channel transaction`)
        const channelTransaction = await dispatch(
            Actions.createChannel(amount, chainProvider)
        )
        if (channelTransaction && channelTransaction.value) {
            const createdChannelIdResult =
                await dispatch(Actions.waitForChannelCreation(channelTransaction.value, chainProvider))
            const channelId = createdChannelIdResult.value

            await dispatch(Thunks.depositIntoCreatedChannel(channelId, statusUpdateListener))
            return channelId
        } else
            return 0
    }
}

export function depositIntoCreatedChannel(id, statusUpdateListener) {
    return async (dispatch, getState, {chainProvider}) => {
        // Deposit Tokens to channel
        statusUpdateListener(`Depositing DBETs into created channel`)
        const channelDepositTransaction = await dispatch(Actions.depositToChannel(id, chainProvider))

        statusUpdateListener(`Waiting for house to activate channel`)
        await dispatch(Actions.waitForChannelActivation(id, channelDepositTransaction, chainProvider))

        // Query the channel's data and add it to the redux state
        await dispatch(Actions.getChannel(id, chainProvider))

        // Update the ether balance
        await dispatch(BalanceActions.getEtherBalance(chainProvider))
        return id
    }
}


/**
 * Spin the slots, wait for the action to complete, AND THEN increase the nonce.
 * @param {string} channelId
 * @param {string} msg
 */
export function spinAndIncreaseNonce(channelId, msg) {
    return async dispatch2 => {
        await dispatch2(Actions.postSpin(channelId, msg))
        await dispatch2(Actions.nonceIncrease(channelId))
    }
}

export function initializeGame(channelId) {
    return async (dispatch, getState, {chainProvider}) => {
        await dispatch(Actions.getAesKey(channelId, chainProvider))
        await dispatch(Actions.getChannelDetails(channelId, chainProvider))
        await dispatch(Actions.getLastSpin(channelId, chainProvider))
        await dispatch(watcherChannelFinalized(channelId))
        await dispatch(watcherChannelClaimed(channelId))
    }
}

export function finalizeChannel(channelId, state) {
    return async (dispatch, getState, {chainProvider}) => {
        await dispatch(Actions.finalizeChannel(channelId, state, chainProvider))
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
