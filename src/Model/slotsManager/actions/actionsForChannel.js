import Actions, {PREFIX} from './actionTypes'
import {createActions} from 'redux-actions'
import Helper from '../../../Components/Helper'
import {getChannelDepositParams} from '../functions'
import {
    distinctUntilChanged,
    retry
 } from 'rxjs/operators'
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

// Get the current session balance
async function fetchBalance(chainProvider) {
    let {contractFactory} = chainProvider
    try {
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        let balance = await slotsContract.balanceOf(chainProvider.defaultAccount)
        balance = balance || 0
        return parseFloat(balance).toFixed()
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

/**
 *
 * @param {Object} transaction
 * @param {ChainProvider} chainProvider
 */
async function waitForChannelCreation(transaction, chainProvider) {
    //LogNewChannel
    let {contractFactory} = chainProvider
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    helper.toggleSnackbar('Waiting for create channel confirmation')
    const path = `subscriptions/event?pos=${transaction.blockHash}&addr=${slotsContract.instance.options.address}`
    const ws = chainProvider.makeWebSocketConnection(path)
    return new Promise((resolve, reject) => {
        const subscription = ws.pipe(
            distinctUntilChanged(),
            retry(15),
        ).subscribe(raw => {
            if(raw) {
                let decoded = slotsContract.logNewChannelDecode(raw.data, raw.topics)
                if (decoded && decoded.id && decoded.user === chainProvider.web3.eth.defaultAccount) {
                    subscription.unsubscribe()
                    helper.toggleSnackbar('Create channel transaction confirmed')
                    resolve(decoded.id)
                }
            }

        }, (err) => {
            console.log('Error: ', err)
            reject(err)
        })
    })
}

/**
 *
 * @param channelId
 * @param {Object} transaction
 * @param {ChainProvider} chainProvider
 */
async function waitForChannelActivation(channelId, transaction, chainProvider) {
    //LogChannelActivate
    let {contractFactory} = chainProvider
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    helper.toggleSnackbar('Waiting for channel activation confirmation')
    const path = `subscriptions/event?pos=${transaction.blockHash}&addr=${slotsContract.instance.options.address}`
    const ws = chainProvider.makeWebSocketConnection(path)
    return new Promise((resolve, reject) => {
        const subscription = ws.pipe(
            distinctUntilChanged(),
            retry(15),
        ).subscribe(raw => {
            if(raw) {
                let decoded = slotsContract.logChannelActivateDecode(raw.data, raw.topics)
                if (decoded && decoded.id && decoded.id === channelId) {
                    subscription.unsubscribe()
                    helper.toggleSnackbar('Deposit channel transaction confirmed')
                    resolve(decoded.id)
                }
            }

        }, (err) => {
            console.log('Error: ', err)
            reject(err)
        })
    })
}



// Create a state channel
async function createChannel(deposit, chainProvider) {
    let {contractFactory} = chainProvider
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    const transaction = await slotsContract.createChannel(deposit)
    helper.toggleSnackbar('Successfully sent create channel transaction')
    return transaction
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
function approve(amount, chainProvider) {
    return new Promise(async (resolve, reject) => {
        try {
            let {contractFactory} = chainProvider
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            let tokenContract = await contractFactory.decentBetTokenContract()
            let slotsAddress = slotsContract.instance.options.address

            const approveTx = await tokenContract.approve(slotsAddress, amount.toFixed())
            const allowance = await tokenContract.allowance(chainProvider.defaultAccount, slotsAddress)
            console.log('Token contract approve', approveTx, allowance)

            const approvalEventSubscription = tokenContract
                .getEventSubscription(tokenContract.getPastEvents('Approval', {
                    owner: chainProvider.defaultAccount,
                    spender: slotsAddress,
                    value: amount.toFixed()
                }))

            const approvalSubscription =
                approvalEventSubscription.subscribe(async (events) => {
                    console.log('Approval subscription - Events:', events)
                    if (events.length >= 1) {
                        helper.toggleSnackbar('Successfully sent approve transaction')
                        resolve(approveTx)
                        approvalSubscription.unsubscribe()
                    }
                })

        } catch (err) {
            reject(err)
        }
    })
}

// Deposit new Chips, sourced from wallet's tokens
async function depositChips(amount, chainProvider) {
    return new Promise(async (resolve, reject) => {
    try {
        let {contractFactory} = chainProvider
        console.warn('depositChips', new Date())
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        const tx = await slotsContract.deposit(amount.toFixed())

        const depositEventSubscription = slotsContract
        .getEventSubscription(slotsContract.getPastEvents('LogDeposit', {
            _address: chainProvider.defaultAccount,
            amount: amount.toFixed()
        }))

        const depositSubscription =
            depositEventSubscription.subscribe( async (events) => {
            console.log('Deposit subscription - Events:', events)

            if (events.length >= 1) {
                helper.toggleSnackbar('Successfully sent deposit transaction')
                depositSubscription.unsubscribe()
                resolve(tx)
            }
        })

    } catch (err) {
        reject(err)
    }
})
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

            const claimChannelEventSubscription = contract
                .getEventSubscription(contract.logClaimChannelTokens(channelId, txHash.blockNumber))

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
        [Actions.APPROVE]: approve,
        [Actions.CREATE_CHANNEL]: createChannel,
        [Actions.DEPOSIT_TO_CHANNEL]: depositToChannel,
        [Actions.DEPOSIT_CHIPS]: depositChips,
        [Actions.GET_ALLOWANCE]: fetchAllowance,
        [Actions.WAIT_FOR_CHANNEL_CREATION]: waitForChannelCreation,
        [Actions.WAIT_FOR_CHANNEL_ACTIVATION]: waitForChannelActivation,
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
