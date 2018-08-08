import Actions, { PREFIX } from './actionTypes'
import { createActions } from 'redux-actions'
import Helper from '../../../Components/Helper'
import { getChannelDepositParams } from '../functions'

const helper = new Helper()
// Get the allowance
async function fetchAllowance(chainProvider) {
    let { contractFactory } = chainProvider
    const defaultAccount = chainProvider.defaultAccount
    const contract = await contractFactory.slotsChannelManagerContract()
    const slotsAddress = contract.instance.options.address
    try {
        let tokenContract = await contractFactory.decentBetTokenContract()
        const allowance = await tokenContract.allowance(
            defaultAccount,
            slotsAddress
        )
        return Number(allowance).toFixed()
    } catch (err) {
        console.log('Error retrieving slots channel manager allowance', err)
    }
}

// Starts the current session
async function fetchSessionId({ contractFactory }) {
    try {
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        const session = await slotsContract.currentSession()
        return Number(session)
    } catch (err) {
        console.log('Error retrieving current session', err)
    }
}

// Get the current session balance
async function fetchSessionBalance(chainProvider) {
    let { contractFactory } = chainProvider
    try {
        const sessionId = await fetchSessionId()
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        let balance = await slotsContract.balanceOf(
            chainProvider.defaultAccount,
            sessionId
        )
        balance = balance || 0
        return parseFloat(balance).toFixed()
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

// Create a state channel
async function createChannel(deposit, { contractFactory }) {
    try {
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        const tx = await slotsContract.createChannel(deposit)

        // Get the ChannelId
        const results = tx.logs[0]
        const eventResults = slotsContract.logNewChannelDecode(
            results.data,
            results.topics
        )
        const channelId = eventResults.id

        helper.toggleSnackbar('Successfully sent create channel transaction')
        return channelId
    } catch (err) {
        console.log('Error creating new channel', err.message)
    }
}

// Send a deposit transaction to channel
async function depositToChannel(id, chainProvider) {
    try {
        let { contractFactory } = chainProvider
        const params = await getChannelDepositParams(id, chainProvider)
        const { initialUserNumber, finalUserHash } = params

        let slotsContract = await contractFactory.slotsChannelManagerContract()
        const tx = await slotsContract.depositToChannel(
            id,
            initialUserNumber,
            finalUserHash
        )
        helper.toggleSnackbar(
            'Successfully sent deposit transaction to channel'
        )
        return tx
    } catch (err) {
        console.log('Error sending deposit to channel', err.message)
    }
}

// Increase allowance and then deposit new Chips
async function approveAndDepositChips(amount, chainProvider) {
    let { contractFactory } = chainProvider
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    const slotsAddress = slotsContract.instance.options.address

    try {
        let tokenContract = await contractFactory.decentBetTokenContract()
        const tx1 = await tokenContract.approve(slotsAddress, amount)
        const tx2 = await depositChips(amount, chainProvider)
        helper.toggleSnackbar('Successfully sent approve transaction')
        return [tx1, tx2]
    } catch (err) {
        console.log('Error sending approve tx', err.message)
    }
}

// Deposit new Chips, sourced from wallet's tokens
async function depositChips(amount, { contractFactory }) {
    try {
        let contract = await contractFactory.slotsChannelManagerContract()
        const tx = await contract.deposit(amount)
        helper.toggleSnackbar('Successfully sent deposit transaction')
        return tx
    } catch (err) {
        console.log('Error sending deposit tx', err.message)
    }
}

// Withdraw Chips and return them as Tokens to the Wallet
async function withdrawChips(amount, { contractFactory }) {
    try {
        const session = await fetchSessionId()
        let contract = await contractFactory.slotsChannelManagerContract()
        const tx = await contract.withdraw(amount, session)
        helper.toggleSnackbar('Successfully sent withdraw transaction')
        return tx
    } catch (err) {
        console.log('Error sending withdraw tx', err.message)
    }
}

/**
 * Allows users to claim DBETs from a closed channel
 * @param {number} channelId
 * @param state
 */
async function claimChannel(channelId, { contractFactory }) {
    let contract = await contractFactory.slotsChannelManagerContract()
    const txHash = await contract.claim(channelId)
    helper.toggleSnackbar('Successfully sent claim DBETs transaction')
    return txHash
}

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [PREFIX]: {
        [Actions.APPROVE_AND_DEPOSIT_CHIPS]: approveAndDepositChips,
        [Actions.CREATE_CHANNEL]: createChannel,
        [Actions.DEPOSIT_TO_CHANNEL]: depositToChannel,
        [Actions.DEPOSIT_CHIPS]: depositChips,
        [Actions.GET_ALLOWANCE]: fetchAllowance,
        [Actions.GET_BALANCE]: fetchSessionBalance,
        [Actions.GET_SESSION_ID]: fetchSessionId,
        [Actions.SET_CHANNEL]: channel => channel,
        [Actions.SET_CHANNEL_DEPOSITED]: channelId => ({ channelId }),
        [Actions.SET_CHANNEL_ACTIVATED]: channelId => ({ channelId }),
        [Actions.SET_CHANNEL_FINALIZED]: channelId => ({ channelId }),
        [Actions.SET_CHANNEL_CLAIMED]: (channelId, isHouse) => ({
            channelId,
            isHouse
        }),
        [Actions.CLAIM_CHANNEL]: claimChannel,
        [Actions.WITHDRAW_CHIPS]: withdrawChips
    }
})
