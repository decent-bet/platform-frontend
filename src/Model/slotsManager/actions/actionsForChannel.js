import Actions, {PREFIX} from './actionTypes'
import {createActions} from 'redux-actions'

// Get the allowance
async function fetchAllowance(chainProvider, helper) {
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
        helper.toggleSnackbar('Error retrieving allowance')
        console.log('Error retrieving slots channel manager allowance', err)
    }
}

// Get the current session balance
async function fetchBalance(chainProvider, helper) {
    let {contractFactory} = chainProvider
    try {
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        let balance = await slotsContract.balanceOf(chainProvider.defaultAccount)
        balance = balance || 0
        return parseFloat(balance).toFixed()
    } catch (err) {
        helper.toggleSnackbar('Error retrieving the balance')
        console.log('Error retrieving balance', err.message)
    }
}

/**
 *
 * @param channelId
 * @param {Object} transaction
 * @param contractFactory
 * @param helper
 */
async function waitForChannelActivation(channelId, transaction, contractFactory, helper) {
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    helper.toggleSnackbar('Waiting for channel activation confirmation')
    return await slotsContract.logChannelActivate(channelId, transaction)
    //return await slotsContract.logChannelActivate(channelId)
}

/**
 * Initializes a new channel
 * @param initialDeposit
 * @param chainProvider
 * @param utils
 * @param wsApi
 * @returns {Promise<void>}
 */
async function initChannel(initialDeposit, chainProvider, utils, wsApi) {
    let {contractFactory} = chainProvider
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    let tokenContract = await contractFactory.decentBetTokenContract()
    let slotsInstance = slotsContract.instance
    let tokenInstance = tokenContract.instance
    let slotsAddress = slotsInstance.options.address
    let tokenAddress = tokenInstance.options.address
    let channelNonce = chainProvider.web3.utils.asciiToHex(utils.random(32))
    const params = await utils.getChannelDepositParams(channelNonce)
    const {
        initialUserNumber,
        finalUserHash
    } = params

    let data = {
        approve:
            tokenInstance.methods.approve(
                slotsAddress,
                initialDeposit
            ).encodeABI(),
        deposit:
            slotsInstance.methods.deposit(initialDeposit).encodeABI(),
        createChannel:
            slotsInstance.methods.createChannel(
                initialDeposit,
                channelNonce
            ).encodeABI(),
        depositChannel:
            slotsInstance.methods.depositChannel(
                channelNonce,
                initialUserNumber,
                finalUserHash
            ).encodeABI()
    }

    let clauses =
        [
            {
                to: tokenAddress,
                value: 0,
                data: data.approve
            },
            {
                to: slotsAddress,
                value: 0,
                data: data.deposit
            },
            {
                to: slotsAddress,
                value: 0,
                data: data.createChannel
            },
            {
                to: slotsAddress,
                value: 0,
                data: data.depositChannel
            }
        ]

    const blockRef = await contractFactory._web3.eth.getBlockRef()
    const userTxs = await utils.getTx(clauses, blockRef)

    const result = await wsApi.initChannel(
        initialDeposit,
        channelNonce,
        initialUserNumber,
        finalUserHash,
        userTxs,
        blockRef
    )
    if (result.res.error) {
        throw new Error(`Error initializing channel: ${result.res.message}`)
    }
       

    const {
        id
    } = result.res
    return id
}


// Create a state channel
async function createChannel(deposit, contractFactory, helper) {
    helper.toggleSnackbar('Sending create channel transaction')
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    const transaction = await slotsContract.createChannel(deposit)
    helper.toggleSnackbar('Waiting for create channel confirmation')

    return await slotsContract.logNewChannel(transaction)
}

// Send a deposit transaction to channel
async function depositToChannel(id, contractFactory, helper, utils) {
    try {
        console.log('Deposit to channel', id)
        const params = await utils.getChannelDepositParams(id)
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
function approve(amount, chainProvider, helper) {
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
async function depositChips(amount, chainProvider, helper) {
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
                depositEventSubscription.subscribe(async (events) => {
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
async function withdrawChips(amount, slotsContract, helper) {
    return new Promise(async (resolve, reject) => {
        try {
            slotsContract.logWithdraw().then(data => {
                resolve(data)
            }).catch(e => reject(e))
            await slotsContract.withdraw(amount)
            helper.toggleSnackbar('Successfully sent withdraw transaction')
        } catch (err) {
            console.log('Error sending withdraw tx', err.message)
            reject(err)
        }
    })
}

/**
 * Allows users to claim DBETs from a closed channel
 * @param {number} channelId
 * @param slotsContract
 * @param helper
 */
async function claimChannel(channelId, slotsContract, helper) {
    return new Promise(async (resolve, reject) => {
        try {
            slotsContract.logClaimChannelTokens(channelId).then(({id, isHouse}) => {
                resolve({id, isHouse})
            }).catch(e => reject(e))
            const tx = await slotsContract.claim(channelId)
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
        [Actions.INIT_CHANNEL]: initChannel,
        [Actions.CREATE_CHANNEL]: createChannel,
        [Actions.DEPOSIT_TO_CHANNEL]: depositToChannel,
        [Actions.DEPOSIT_CHIPS]: depositChips,
        [Actions.GET_ALLOWANCE]: fetchAllowance,
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
