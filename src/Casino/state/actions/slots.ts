import Bluebird from 'bluebird'
import cryptoJs, { AES } from 'crypto-js'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from '../actionTypes'
import BigNumber from 'bignumber.js'
import { toDate } from 'date-fns'
import { tap, map } from 'rxjs/operators'

// Get the allowance
async function fetchAllowance(chainProvider, helper) {
    let { contractFactory } = chainProvider
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
        return 0
        // helper.toggleSnackbar('Error retrieving allowance')
        console.log('Error retrieving slots channel manager allowance', err)
    }
}

// Get the current session balance
async function fetchBalance(chainProvider, helper) {
    let { contractFactory } = chainProvider
    try {
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        let balance = await slotsContract.balanceOf(
            chainProvider.defaultAccount
        )
        balance = balance || 0
        return parseFloat(balance).toFixed()
    } catch (err) {
        // helper.toggleSnackbar('Error retrieving the balance')
        console.log('Error retrieving balance', err.message)
        return 0
    }
}

/**
 *
 * @param channelId
 * @param {Object} transaction
 * @param {ChainProvider} chainProvider
 */
async function waitForChannelActivation(
    channelId,
    transaction,
    contractFactory,
    helper
) {
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    // helper.toggleSnackbar('Waiting for channel activation confirmation')
    return await slotsContract.logChannelActivate(channelId, transaction)
}

// Create a state channel
async function createChannel(deposit, contractFactory, helper) {
    // helper.toggleSnackbar('Sending create channel transaction')
    let slotsContract = await contractFactory.slotsChannelManagerContract()
    const transaction = await slotsContract.createChannel(deposit)
    // helper.toggleSnackbar('Waiting for create channel confirmation')

    return await slotsContract.logNewChannel(transaction)
}

// Send a deposit transaction to channel
async function depositToChannel(id, contractFactory, utils) {
    try {
        console.log('Deposit to channel', id)
        let randomNumber = utils.random(18).toString()

        const key = await utils.getAesKey(id)
        let initialUserNumber = AES.encrypt(randomNumber, key).toString()
        let userHashes = utils.getUserHashes(randomNumber)
        let finalUserHash = userHashes[userHashes.length - 1]
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        const tx = await slotsContract.depositToChannel(
            id,
            initialUserNumber,
            finalUserHash
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
            let { contractFactory } = chainProvider
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            let tokenContract = await contractFactory.decentBetTokenContract()
            let slotsAddress = slotsContract.instance.options.address

            const approveTx = await tokenContract.approve(
                slotsAddress,
                amount.toFixed()
            )
            const allowance = await tokenContract.allowance(
                chainProvider.defaultAccount,
                slotsAddress
            )
            console.log('Token contract approve', approveTx, allowance)

            const approvalEventSubscription = tokenContract.getEventSubscription(
                tokenContract.getPastEvents('Approval', {
                    owner: chainProvider.defaultAccount,
                    spender: slotsAddress,
                    value: amount.toFixed()
                })
            )

            const approvalSubscription = approvalEventSubscription.subscribe(
                async events => {
                    console.log('Approval subscription - Events:', events)
                    if (events.length >= 1) {
                        // helper.toggleSnackbar('Successfully sent approve transaction')
                        resolve(approveTx)
                        approvalSubscription.unsubscribe()
                    }
                }
            )
        } catch (err) {
            reject(err)
        }
    })
}

// Deposit new Chips, sourced from wallet's tokens
async function depositChips(amount, chainProvider, helper) {
    return new Promise(async (resolve, reject) => {
        try {
            let { contractFactory } = chainProvider
            console.warn('depositChips', new Date())
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            const tx = await slotsContract.deposit(amount.toFixed())

            const depositEventSubscription = slotsContract.getEventSubscription(
                slotsContract.getPastEvents('LogDeposit', {
                    _address: chainProvider.defaultAccount,
                    amount: amount.toFixed()
                })
            )

            const depositSubscription = depositEventSubscription.subscribe(
                async events => {
                    console.log('Deposit subscription - Events:', events)

                    if (events.length >= 1) {
                        // helper.toggleSnackbar('Successfully sent deposit transaction')
                        depositSubscription.unsubscribe()
                        resolve(tx)
                    }
                }
            )
        } catch (err) {
            reject(err)
        }
    })
}

// Withdraw Chips and return them as Tokens to the Wallet
async function withdrawChips(amount, contract, helper) {
    return new Promise(async (resolve, reject) => {
        try {
            const tx = await contract.withdraw(amount)

            const withdrawEventSubscription = contract.getEventSubscription(
                contract.logWithdraw(tx.blockNumber)
            )

            const withdrawSubscription = withdrawEventSubscription.subscribe(
                async events => {
                    console.log('Withdraw subscription - Events:', events)
                    if (events.length >= 1) {
                        withdrawSubscription.unsubscribe()
                        resolve(tx)
                    }
                }
            )
            // helper.toggleSnackbar('Successfully sent withdraw transaction')
            return tx
        } catch (err) {
            console.log('Error sending withdraw tx', err.message)
            reject(err)
        }
    })
}

/**
 * Allows users to claim DBETs from a closed channel
 * @param {number} channelId
 * @param state
 */
async function claimChannel(channelId, contract, helper) {
    return new Promise(async (resolve, reject) => {
        try {
            const txHash = await contract.claim(channelId)

            const claimChannelEventSubscription = contract.getEventSubscription(
                contract.logClaimChannelTokens(channelId, txHash.blockNumber)
            )

            const claimChannelSubscription = claimChannelEventSubscription.subscribe(
                async events => {
                    console.log('Claim channel subscription - Events:', events)
                    if (events.length >= 1) {
                        // helper.toggleSnackbar('Successfully sent claim DBETs transaction')
                        claimChannelSubscription.unsubscribe()
                        resolve(txHash)
                    }
                }
            )
        } catch (e) {
            reject(e)
        }
    })
}

async function fetchAesKey(channelId, keyHandler, web3) {
    const idHash = web3.utils.soliditySha3(channelId)
    let { privateKey } = await keyHandler.get()
    let sign = web3.eth.accounts.sign(idHash, privateKey)
    let key = sign.signature
    return { channelId, key }
}

/**
 * The Basic information of a State Channel
 * @param channelId
 * @param contractFactory
 */
async function getChannelInfo(channelId, contract, helper) {
    try {
        const info = await contract.getChannelInfo(channelId)
        const playerAddress = info[0]
        return {
            playerAddress,
            ready: info[1],
            activated: info[2],
            finalized: info[3],
            initialDeposit: info[4],
            finalNonce: info[5],
            endTime: toDate(info[6]),
            exists: playerAddress === '0x0'
        }
    } catch (error) {
        // helper.toggleSnackbar('Error retrieving channel details')
        console.log('Error retrieving channel details', error.message)
        return null
    }
}

/**
 * Get the player's house address
 * @param channelId
 * @param contractFactory
 */
async function getAuthorizedAddress(channelId, contract, helper) {
    try {
        return await contract.getPlayer(channelId, true)
    } catch (error) {
        // helper.toggleSnackbar('Error retrieving house authorized address')
        console.log('Error retrieving house authorized address', error.message)
    }
}

/**
 * Is the channel closed?
 * @param channelId
 * @param contractFactory
 */
async function isChannelClosed(channelId, contract, helper) {
    try {
        return await contract.isChannelClosed(channelId)
    } catch (err) {
        // helper.toggleSnackbar('Error retrieving is channel closed')
        console.log('Error retrieving is channel closed', err.message)
    }
}

/**
 * Get the other channel hashes
 * @param {number} id
 * @param {Object} contract
 */
async function getChannelHashes(id, contract, helper) {
    try {
        const hashes = await contract.getChannelHashes(id)
        console.log('Hashes', hashes, id)
        return {
            finalUserHash: hashes[0],
            initialUserNumber: hashes[1],
            finalReelHash: hashes[2],
            finalSeedHash: hashes[3]
        }
    } catch (err) {
        // helper.toggleSnackbar('Error retrieving channel hashes')
        console.log('Error retrieving channel hashes', err.message)
        return null
    }
}

async function getDeposited(channelId, isHouse = false, contract) {
    const rawBalance = await contract.channelDeposits(channelId, isHouse)
    return new BigNumber(rawBalance)
}

async function getFinalBalances(channelId, isHouse = false, contract) {
    const finalBalance = await contract.finalBalances(channelId, isHouse)
    return new BigNumber(finalBalance)
}

/**
 * Get info and hashes required to interact with an active channel
 * @param id
 * @param chainProvider
 */
async function getChannelDetails(id, contractFactory, helper) {
    let contract = await contractFactory.slotsChannelManagerContract()

    let [
        deposited,
        finalBalances,
        info,
        houseAuthorizedAddress,
        closed,
        hashes
    ] = await Promise.all([
        getDeposited(id, false, contract),
        getFinalBalances(id, false, contract),
        getChannelInfo(id, contract, helper),
        getAuthorizedAddress(id, contract, helper),
        isChannelClosed(id, contract, helper),
        getChannelHashes(id, contract, helper)
    ])

    console.log('getChannelDetails', {
        deposited,
        finalBalances,
        channelId: id,
        info,
        houseAuthorizedAddress,
        closed,
        hashes
    })

    return {
        deposited,
        finalBalances,
        channelId: id,
        info,
        houseAuthorizedAddress,
        closed,
        hashes
    }
}

/**
 * Loads the last spin for an active channel
 * @param id
 * @param hashes
 * @param aesKey
 * @param chainProvider
 */
async function loadLastSpin(id, hashes, aesKey, httpApi, utils) {
    let result

    try {
        result = await Bluebird.fromCallback(cb => httpApi.getLastSpin(id, cb))
    } catch (e) {
        result = {
            userSpin: null,
            houseSpin: null,
            nonce: 0
        }
    }
    console.log('loadLastSpin', result)
    let encryptedSpin = result.userSpin
    let houseSpin = result.houseSpin
    let nonce = result.nonce ? result.nonce + 1 : 1
    let userSpin, houseSpins
    if (encryptedSpin) {
        try {
            let rawSpinData = AES.decrypt(encryptedSpin, aesKey)
            userSpin = JSON.parse(rawSpinData.toString(cryptoJs.enc.Utf8))
        } catch (e) {
            throw e
        }
    }
    if (houseSpin) {
        houseSpins = [houseSpin]
    } else {
        houseSpins = []
    }
    console.log('Last spin', result, nonce)
    console.log('loadLastSpin', {
        result,
        encryptedSpin,
        houseSpin,
        nonce,
        userSpin,
        houseSpins,
        initialUserNumber: hashes.initialUserNumber,
        aesKey
    })

    let initialUserNumber = AES.decrypt(
        hashes.initialUserNumber,
        aesKey
    ).toString(cryptoJs.enc.Utf8)
    let userHashes = utils.getUserHashes(initialUserNumber)
    let index = userHashes.length - 1
    if (userHashes[index] !== hashes.finalUserHash) {
        console.warn(
            'Invalid initial User Number',
            userHashes[index],
            hashes.finalUserHash
        )
        throw new Error('Invalid initial User Number')
    }

    return {
        nonce,
        houseSpins,
        userHashes,
        userSpin
    }
}

async function getLastSpin(channelId, chainProvider, httpApi, helper, utils) {
    let { contractFactory } = chainProvider
    let contract = await contractFactory.slotsChannelManagerContract()
    console.log('getLastSpin', channelId)
    let aesKey = await utils.getAesKey(channelId)
    let hashes = await getChannelHashes(channelId, contract, helper)
    let data = await loadLastSpin(channelId, hashes, aesKey, httpApi, utils)
    console.log('getLastSpin', { aesKey, hashes, data })

    return {
        channelId,
        nonce: data.nonce,
        houseSpins: data.houseSpins,
        userHashes: data.userHashes,
        lastSpinLoaded: true
    }
}

/**
 * Gets a single channel's data
 * @param {string} channelId
 * @param chainProvider
 */
async function getChannel(channelId, chainProvider, httpApi, helper, utils) {
    // Execute both actions in parallel
    console.log('getChannel', channelId)
    let { contractFactory } = chainProvider
    let channelDetails = await getChannelDetails(
        channelId,
        contractFactory,
        helper
    )
    console.log('getChannel', channelDetails)
    let lastSpin
    if (channelDetails && channelDetails.info && channelDetails.info.activated)
        lastSpin = await getLastSpin(
            channelId,
            chainProvider,
            httpApi,
            helper,
            utils
        )

    return {
        ...channelDetails,
        ...lastSpin
    }
}

function logChannels(title) {
    return event => {
        console.log(title, event)
    }
}

/**
 * Get all channels for a user
 */
function getChannels(chainProvider, httpApi, helper, utils) {
    return new Promise(async (resolve, reject) => {
        try {
            const topRequests = 3
            let totalRequests = 0
            const { contractFactory } = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()

            // get the subscription
            const getChannels$ = contract.getEventSubscription(
                contract.getChannels()
            )

            const channels$ = getChannels$.pipe(
                tap(() => {
                    totalRequests++
                }),
                tap(logChannels('BEFORE mergeMap -----------')),
                map((i: any[]) => {
                    console.log('ON MERGE MAP', i)
                    return i.map(event =>
                        getChannel(
                            event.returnValues.id,
                            chainProvider,
                            httpApi,
                            helper,
                            utils
                        )
                    )
                })
            )
            console.log('channels$', channels$)

            const subs = channels$.subscribe(async items => {
                console.log('channels$.subscribe', items)
                if (items.length >= 1 || totalRequests >= topRequests) {
                    subs.unsubscribe() // stop making requests
                    let resolved = await Promise.all(items) // get all channels info
                    console.log('channels$.subscribe resolved', resolved)

                    // convert into an object because all the components and reducers
                    // are wating for this kind of structure
                    const result = resolved.reduce((mem, channel: any) => {
                        console.log('channels$.subscribe reduce', mem, channel)
                        mem[channel.channelId] = channel
                        return mem
                    }, {})
                    console.log('channels$.subscribe result', result)

                    resolve(result)
                }
            }, reject)
        } catch (e) {
            return reject(e)
        }
    })
}

/**
 * Finalizes a channel allowing users to claim DBETs
 * @param {number} channelId
 * @param {Object} state
 * @param {Object} injectedDependencies
 */
async function finalizeChannel(
    channelId: number,
    state: any,
    { contractFactory, keyHandler, utils }: any
) {
    // let aesKey = state.aesKey
    try {
        let betSize = utils.convertToEther(1)

        let userSpin = await utils.getSpin(betSize, state, true, keyHandler)
        let lastHouseSpin
        let txHash
        let contract = await contractFactory.slotsChannelFinalizerContract()
        // If the user nonce is 0
        // this would mean that there haven't been any spin performed within the channel.
        if (userSpin.nonce === 0) {
            txHash = await contract.finalizeZeroNonce(channelId, userSpin)
        } else {
            lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
            txHash = await contract.finalize(channelId, userSpin, lastHouseSpin)
        }
        /**
         * After sending a finalize channel tx on the Ethereum network let the state channel API know that
         * the transaction was sent to make sure future spins aren't processed.
         */

        await Bluebird.fromCallback(
            cb =>
                // httpApi.finalizeChannel(channelId, userSpin, aesKey, cb)
                0
        )

        // let message = 'Successfully sent finalize channel transaction'
        // helper.toggleSnackbar(message)
        return txHash
    } catch (err) {
        // helper.toggleSnackbar('Error sending finalize channel transaction')
        throw new Error('Error closing channel, ' + err.message)
    }
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_AES_KEY]: fetchAesKey,
        [Actions.GET_CHANNEL]: getChannel,
        [Actions.GET_CHANNELS]: getChannels,
        [Actions.APPROVE]: approve,
        [Actions.CREATE_CHANNEL]: createChannel,
        [Actions.DEPOSIT_TO_CHANNEL]: depositToChannel,
        [Actions.DEPOSIT_CHIPS]: depositChips,
        [Actions.GET_ALLOWANCE]: fetchAllowance,
        [Actions.WAIT_FOR_CHANNEL_ACTIVATION]: waitForChannelActivation,
        [Actions.GET_BALANCE]: fetchBalance,
        [Actions.SET_CHANNEL]: channel => channel,
        [Actions.SET_CHANNEL_DEPOSITED]: channelId => ({ channelId }),
        [Actions.SET_CHANNEL_ACTIVATED]: channelId => ({ channelId }),
        [Actions.SET_CHANNEL_FINALIZED]: channelId => ({ channelId }),
        [Actions.SET_CHANNEL_CLAIMED]: (channelId, isHouse) => ({
            channelId,
            isHouse
        }),
        [Actions.CLAIM_CHANNEL]: claimChannel,
        [Actions.WITHDRAW_CHIPS]: withdrawChips,
        [Actions.GET_CHANNEL_DETAILS]: getChannelDetails,
        [Actions.GET_LAST_SPIN]: getLastSpin,
        [Actions.FINALIZE_CHANNEL]: finalizeChannel,
        [Actions.NONCE_INCREASE]: channelId => ({ channelId }),
        [Actions.POST_SPIN]: (channelId, spin) => ({ ...spin, channelId })
    }
})
