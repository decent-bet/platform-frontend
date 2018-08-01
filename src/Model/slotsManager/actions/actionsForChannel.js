import Actions, { PREFIX } from './actionTypes'
import { createActions } from 'redux-actions'
import Helper from '../../../Components/Helper'
import { getChannelDepositParams } from '../functions'
import { ThorConnection } from '../../../Web3/ThorConnection'

const helper = new Helper()
const contractFactory = ThorConnection.contractFactory()
// Get the allowance
async function fetchAllowance() {
    const defaultAccount = ThorConnection.getDefaultAccount()
    const contract = await contractFactory.slotsChannelManagerContract()
    const slotsAddress = await contract.instance.options.address
    
    try {
        let tokenContract = await contractFactory.decentBetTokenContract()
        const allowance = await tokenContract.allowance(defaultAccount, slotsAddress)

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
        let slotsChannelManagerContract = await contractFactory.slotsChannelManagerContract()
        const session = await slotsChannelManagerContract.currentSession()
        return Number(session)
    } catch (err) {
        console.log('Error retrieving current session', err)
    }
}

// Get the current session balance
async function fetchSessionBalance() {
    try {
        const sessionId = await fetchSessionId()
        let balance = await contractFactory.slotsChannelManagerContract().balanceOf(
                            ThorConnection.thor().eth.defaultAccount,
            sessionId
        )
        balance = balance || 0
        return parseFloat(balance).toFixed()
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

// Create a state channel
async function createChannel(deposit) {
    try {
        const tx = await contractFactory.slotsChannelManagerContract().createChannel(deposit)

        // Get the ChannelId
        const results = tx.logs[0]
        const eventResults = contractFactory.slotsChannelManagerContract().logNewChannelDecode(
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

        const tx = await contractFactory.slotsChannelManagerContract.depositToChannel(
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
    let contract = await contractFactory.slotsChannelManagerContract()
    const contractAddress = contract.instance.options.address

    try {
        const tx1 = await contractFactory.decentBetTokenContract()
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
    try {
        const tx = await contractFactory.slotsChannelManagerContract().deposit(amount)
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
        const tx = await contractFactory.slotsChannelManagerContract().withdraw(amount, session)
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
    const txHash = await contractFactory.slotsChannelManagerContract()
                                        .claim(channelId)
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
