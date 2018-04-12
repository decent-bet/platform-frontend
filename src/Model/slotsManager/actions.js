import Actions, { PREFIX } from './actionTypes'
import { createActions } from 'redux-actions'
import Helper from '../../Components/Helper'
import SlotsChannelHandler from '../../Components/Dapp/Casino/SlotsChannelHandler'

const helper = new Helper()
const slotsChannelHandler = new SlotsChannelHandler()

// Get the allowance
async function fetchAllowance() {
    let contractHelper = helper.getContractHelper()
    let defaultAccount = helper.getWeb3().eth.defaultAccount
    let slotsAddress = contractHelper.getSlotsChannelManagerInstance().address
    try {
        let allowance = await contractHelper
            .getWrappers()
            .token()
            .allowance(defaultAccount, slotsAddress)
        return allowance.toFixed()
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
        let session = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .currentSession()
        return session.toNumber()
    } catch (err) {
        console.log('Error retrieving current session', err.message)
    }
}

// Get the current session balance
async function fetchSessionBalance() {
    try {
        let sessionId = await fetchSessionId()
        let balance = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .balanceOf(helper.getWeb3().eth.defaultAccount, sessionId)
        return balance.toFixed()
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

// Create a state channel
async function createChannel(deposit) {
    try {
        let tx = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .createChannel(deposit)
        helper.toggleSnackbar('Successfully sent create channel transaction')
        return tx
    } catch (err) {
        console.log('Error creating new channel', err.message)
    }
}

// Send a deposit transaction to channel
async function depositToChannel(id) {
    let params = await slotsChannelHandler.getChannelDepositParamsAsync(id)
    let { initialUserNumber, finalUserHash } = params

    try {
        let tx = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .depositToChannel(id, initialUserNumber, finalUserHash)
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
    try {
        let contractHelper = helper.getContractHelper()
        let contractAddress = contractHelper.getSlotsChannelManagerInstance()
            .address
        let tx = await contractHelper
            .getWrappers()
            .token()
            .approve(contractAddress, amount)
        let tx2 = await depositChips(amount)
        helper.toggleSnackbar('Successfully sent approve transaction')
        return [tx, tx2]
    } catch (err) {
        console.log('Error sending approve tx', err.message)
    }
}

// Deposit new Chips, sourced from wallet's tokens
async function depositChips(amount) {
    try {
        let tx = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .deposit(amount)
        helper.toggleSnackbar('Successfully sent deposit transaction')
        return tx
    } catch (err) {
        console.log('Error sending deposit tx', err.message)
    }
}

// Withdraw Chips and return them as Tokens to the Wallet
async function withdrawChips(amount) {
    try {
        let session = await fetchSessionId()
        let tx = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .withdraw(amount, session)
        helper.toggleSnackbar('Successfully sent withdraw transaction')
        return tx
    } catch (err) {
        console.log('Error sending withdraw tx', err.message)
    }
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
        [Actions.WITHDRAW_CHIPS]: withdrawChips
    }
})
