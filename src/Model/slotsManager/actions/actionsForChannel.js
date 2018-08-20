import Actions, {PREFIX} from './actionTypes'
import {createActions} from 'redux-actions'
import Helper from '../../../Components/Helper'
import {getChannelDepositParams} from '../functions'

const helper = new Helper()

// Get the allowance
async function fetchAllowance(chainProvider) {
    let {contractFactory} = chainProvider
    try {
        const defaultAccount = chainProvider.defaultAccount
        const contract = await contractFactory.slotsChannelManagerContract()
        const slotsAddress = contract.instance.options.address

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
async function fetchSessionId(slotsContract) {
    try {
        const session = await slotsContract.currentSession()
        return Number(session)
    } catch (err) {
        console.log('Error retrieving current session', err.message)
    }
}

// Get the current session balance
async function fetchBalance(chainProvider) {
    let {contractFactory} = chainProvider
    try {
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        const sessionId = await fetchSessionId(slotsContract)
        let balance = await slotsContract.balanceOf(chainProvider.defaultAccount, sessionId)
        balance = balance || 0
        return parseFloat(balance).toFixed()
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

// Create a state channel
function createChannel(deposit, chainProvider) {
    return new Promise(async (resolve, reject) => {
        try {
            let {contractFactory} = chainProvider
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            const tx = await slotsContract.createChannel(deposit)

            const newChannelEventSubscription = await slotsContract
                .getEventSubscription(slotsContract.getPastEvents('LogNewChannel', {
                    filter: {
                        user: chainProvider.defaultAccount,
                        initialDeposit: deposit
                    },
                    fromBlock: tx.blockNumber
                }))

            const newChannelSubscription =
                newChannelEventSubscription.subscribe(async (events) => {
                    // Since getPastEvents() order option doesn't work, sort by block number manually
                    if (events.length >= 1) {
                        events.sort((eventA, eventB) => {
                            return eventB.blockNumber - eventA.blockNumber
                        })
                        helper.toggleSnackbar('Successfully sent create channel transaction')
                        let id = events[0].returnValues.id
                        newChannelSubscription.unsubscribe()
                        resolve(id)
                    }
                })
        } catch (err) {
            reject(err)
        }
    })
}

// Send a deposit transaction to channel
async function depositToChannel(id, chainProvider) {
    try {
        console.log('Deposit to channel', id)
        let {contractFactory} = chainProvider
        const params = await getChannelDepositParams(id, chainProvider)
        const {initialUserNumber, finalUserHash} = params

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

// Deposit new Chips, sourced from wallet's tokens
function approveAndDepositChips(amount, chainProvider) {
    return new Promise(async (resolve, reject) => {
        try {
            let {contractFactory} = chainProvider
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            let tokenContract = await contractFactory.decentBetTokenContract()
            let slotsAddress = slotsContract.instance.options.address

            const approveTx = await tokenContract.approve(slotsAddress, amount.toFixed())
            const allowance = await tokenContract.allowance(chainProvider.defaultAccount, slotsAddress)
            console.log('Token contract approve', approveTx, allowance)

            const onApproval = async () => {
                const depositTx = await slotsContract.deposit(amount.toFixed())
                console.log('Slots deposit', depositTx)

                const depositEventSubscription = await slotsContract
                    .getEventSubscription(slotsContract.getPastEvents('LogDeposit', {
                        filter: {
                            _address: chainProvider.defaultAccount,
                            amount: amount.toFixed()
                        }
                    }))

                const depositSubscription =
                    depositEventSubscription.subscribe(async (events) => {
                        console.log('Deposit subscription - Events:', events)

                        if (events.length >= 1) {
                            const updatedBalance = await slotsContract.balanceOf(chainProvider.defaultAccount)
                            console.log('Updated balance', updatedBalance, chainProvider.defaultAccount)
                            helper.toggleSnackbar('Successfully sent deposit transaction')
                            depositSubscription.unsubscribe()
                            resolve(depositTx)
                        }
                    })
            }

            const approvalEventSubscription = await tokenContract
                .getEventSubscription(tokenContract.getPastEvents('Approval', {
                    filter: {
                        owner: chainProvider.defaultAccount,
                        spender: slotsAddress,
                        value: amount.toFixed()
                    },
                }))

            const approvalSubscription =
                approvalEventSubscription.subscribe(async (events) => {
                    console.log('Approval subscription - Events:', events)
                    if (events.length >= 1) {
                        helper.toggleSnackbar('Successfully sent approve transaction')
                        await onApproval()
                        approvalSubscription.unsubscribe()
                    }
                })

        } catch (err) {
            reject(err)
        }
    })
}

// Deposit new Chips, sourced from wallet's tokens
async function depositChips(amount, {contractFactory}) {
    try {
        let contract = await contractFactory.slotsChannelManagerContract()
        const tx = await contract.deposit(amount.toFixed())
        helper.toggleSnackbar('Successfully sent deposit transaction')
        return tx
    } catch (err) {
        console.log('Error sending deposit tx', err.message)
    }
}

// Withdraw Chips and return them as Tokens to the Wallet
async function withdrawChips(amount, chainProvider) {
    try {
        let {contractFactory} = chainProvider
        let contract = await contractFactory.slotsChannelManagerContract()
        const tx = await contract.withdraw(amount)
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
async function claimChannel(channelId, {contractFactory}) {
    return new Promise(async (resolve, reject) => {
        try {
            let contract = await contractFactory.slotsChannelManagerContract()
            const txHash = await contract.claim(channelId)

            const claimChannelEventSubscription = await contract
                .getEventSubscription(contract.logClaimChannelTokens(channelId))

            const claimChannelSubscription =
                claimChannelEventSubscription.subscribe(async (events) => {
                    console.log('Claim channel subscription - Events:', events)
                    if (events.length >= 1) {
                        helper.toggleSnackbar('Successfully sent claim DBETs transaction')
                        claimChannelSubscription.unsubscribe()
                        resolve(txHash)
                    }
                })
        } catch (e) {
            reject(e)
        }
    })
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
        [Actions.GET_BALANCE]: fetchBalance,
        [Actions.SET_CHANNEL]: channel => channel,
        [Actions.SET_CHANNEL_DEPOSITED]: channelId => ({channelId}),
        [Actions.SET_CHANNEL_ACTIVATED]: channelId => ({channelId}),
        [Actions.SET_CHANNEL_FINALIZED]: channelId => ({channelId}),
        [Actions.SET_CHANNEL_CLAIMED]: (channelId, isHouse) => ({
            channelId,
            isHouse
        }),
        [Actions.CLAIM_CHANNEL]: claimChannel,
        [Actions.WITHDRAW_CHIPS]: withdrawChips
    }
})
