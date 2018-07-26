import Actions, { PREFIX } from './actionTypes'
import { createActions } from 'redux-actions'
import Helper from '../../../Components/Helper'
import { getChannelDepositParams } from '../functions'

const helper = new Helper()

// Get the allowance
async function fetchAllowance() {
    const contractHelper = helper.getContractHelper()
    const defaultAccount = helper.getWeb3().eth.defaultAccount
    const slotsAddress = contractHelper.SlotsChannelManager.contract.options.address
    try {
        const allowance = await contractHelper
            .getWrappers()
            .token()
            .allowance(defaultAccount, slotsAddress)

        return parseFloat(allowance).toFixed()
    } catch (err) {
        console.log(
            'Error retrieving slots channel manager allowance',
            err.message
        )
    }
}

// Starts the current session
async function fetchSessionId() {
    try {
        const instance = helper.getContractHelper().SlotsChannelManager
        const session = await instance.currentSession()
        return Number(session)
    } catch (err) {
        console.log('Error retrieving current session', err)
    }
}

// Get the current session balance
async function fetchSessionBalance() {
    try {
        const sessionId = await fetchSessionId()
        const balance = await helper.getContractHelper().SlotsChannelManager.balanceOf(
            helper.getWeb3().eth.defaultAccount,
            sessionId
        )
        return parseFloat(balance).toFixed()
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

// Create a state channel
async function createChannel(deposit) {
    try {
        const instance = helper.getContractHelper().SlotsChannelManager
        const tx = await instance.createChannel(deposit)

        // Get the ChannelId
        const results = tx.logs[0]
        const eventResults = instance.logNewChannelDecode(
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
async function depositToChannel(id) {
    const params = await getChannelDepositParams(id)
    const { initialUserNumber, finalUserHash } = params
    try {
        const instance = helper.getContractHelper().SlotsChannelManager
        const tx = await instance.depositToChannel(
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
async function approveAndDepositChips(amount) {
    const contractHelper = helper.getContractHelper()
    const contractAddress = contractHelper.SlotsChannelManager.contract.options.address
    try {
        const tx1 = await contractHelper
            .getWrappers()
            .token()
            .approve(contractAddress, amount)
        const tx2 = await depositChips(amount)
        helper.toggleSnackbar('Successfully sent approve transaction')
        return [tx1, tx2]
    } catch (err) {
        console.log('Error sending approve tx', err.message)
    }
}

// Deposit new Chips, sourced from wallet's tokens
async function depositChips(amount) {
    const instance = helper.getContractHelper().SlotsChannelManager
    try {
        const tx = await instance.deposit(amount)
        helper.toggleSnackbar('Successfully sent deposit transaction')
        return tx
    } catch (err) {
        console.log('Error sending deposit tx', err.message)
    }
}

// Withdraw Chips and return them as Tokens to the Wallet
async function withdrawChips(amount) {
    try {
        const session = await fetchSessionId()
        const instance = helper.getContractHelper().SlotsChannelManager
        const tx = await instance.withdraw(amount, session)
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
async function claimChannel(channelId) {
    const instance = helper.getContractHelper().SlotsChannelManager
    const txHash = await instance.claim(channelId)
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
