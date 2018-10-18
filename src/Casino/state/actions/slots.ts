import CryptoJs, { AES } from 'crypto-js'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from '../actionTypes'
import BigNumber from 'bignumber.js'
import { toDate } from 'date-fns'
import { tap, map } from 'rxjs/operators'
import { IContractFactory, IUtils } from 'src/common/types'

// Get the allowance
function fetchAllowance(contractFactory, defaultAccount): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await contractFactory.slotsChannelManagerContract()
            const slotsAddress = contract.instance.options.address

            let tokenContract = await contractFactory.decentBetTokenContract()
            const allowance = await tokenContract.allowance(
                defaultAccount,
                slotsAddress
            )
            resolve(Number(allowance).toFixed())
        } catch (err) {
            reject({
                message: 'Error retrieving slots channel manager allowance'
            })
        }
    })
}

/**
 *
 * @param channelId
 * @param {Object} transaction
 * @param contractFactory
 */
function waitForChannelActivation(
    channelId,
    transaction,
    contractFactory
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            const result = await slotsContract.logChannelActivate(
                channelId,
                transaction
            )
            resolve(result)
        } catch (error) {
            reject({ message: error.message })
        }
    })
}

/**
 * Initializes a new channel
 * @param initialDeposit
 * @param utils
 * @param wsApi
 * @returns {Promise<void>}
 */
function initChannel(
    initialDeposit: number,
    contractFactory: IContractFactory,
    thorify: any,
    utils: IUtils,
    wsApi: any
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            let tokenContract = await contractFactory.decentBetTokenContract()
            let slotsInstance = slotsContract.instance
            let tokenInstance = tokenContract.instance
            let slotsAddress = slotsInstance.options.address
            let tokenAddress = tokenInstance.options.address
            let channelNonce = thorify.utils.asciiToHex(utils.random(32))
            const params = await utils.getChannelDepositParams(channelNonce)
            const { initialUserNumber, finalUserHash } = params

            let data = {
                approve: tokenInstance.methods
                    .approve(slotsAddress, initialDeposit)
                    .encodeABI(),
                deposit: slotsInstance.methods
                    .deposit(initialDeposit)
                    .encodeABI(),
                createChannel: slotsInstance.methods
                    .createChannel(initialDeposit, channelNonce)
                    .encodeABI(),
                depositChannel: slotsInstance.methods
                    .depositChannel(
                        channelNonce,
                        initialUserNumber,
                        finalUserHash
                    )
                    .encodeABI()
            }

            let clauses = [
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

            const blockRef = await thorify.eth.getBlockRef()
            const userTxs = await utils.getTx(clauses, blockRef)

            const result = await wsApi.initChannel(
                initialDeposit,
                channelNonce,
                initialUserNumber,
                finalUserHash,
                userTxs,
                blockRef
            )
            if (result.res.error)
                throw new Error(
                    `Error initializing channel: ${result.res.message}`
                )

            const { id } = result.res
            resolve(id)
        } catch (error) {
            reject({ message: error.message })
        }
    })
}

// Create a state channel
function createChannel(deposit, contractFactory): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            const transaction = await slotsContract.createChannel(deposit)

            const result = await slotsContract.logNewChannel(transaction)
            resolve(result)
        } catch (error) {
            reject({ message: 'Error creating a channel' })
        }
    })
}

// Send a deposit transaction to channel
function depositToChannel(id, contractFactory, utils): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Deposit to channel', id)
            const params = await utils.getChannelDepositParams(id)
            const { initialUserNumber, finalUserHash } = params

            let slotsContract = await contractFactory.slotsChannelManagerContract()
            const tx = await slotsContract.depositToChannel(
                id,
                initialUserNumber,
                finalUserHash
            )
            resolve(tx)
        } catch (err) {
            reject({ message: 'Error sending deposit to channel' })
        }
    })
}

// Deposit new Chips, sourced from wallet's tokens
function approve(amount, contractFactory, defaultAccount) {
    return new Promise(async (resolve, reject) => {
        try {
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            let tokenContract = await contractFactory.decentBetTokenContract()
            let slotsAddress = slotsContract.instance.options.address

            const approveTx = await tokenContract.approve(
                slotsAddress,
                amount.toFixed()
            )
            const allowance = await tokenContract.allowance(
                defaultAccount,
                slotsAddress
            )
            console.log('Token contract approve', approveTx, allowance)

            const approvalEventSubscription = tokenContract.getEventSubscription(
                tokenContract.getPastEvents('Approval', {
                    owner: defaultAccount,
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
            reject({ message: err.message })
        }
    })
}

// Deposit new Chips, sourced from wallet's tokens
function depositChips(amount, contractFactory, defaultAccount) {
    return new Promise(async (resolve, reject) => {
        try {
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            const tx = await slotsContract.deposit(amount.toFixed())

            const depositEventSubscription = slotsContract.getEventSubscription(
                slotsContract.getPastEvents('LogDeposit', {
                    _address: defaultAccount,
                    amount: amount.toFixed()
                })
            )

            const depositSubscription = depositEventSubscription.subscribe(
                async events => {
                    if (events.length >= 1) {
                        depositSubscription.unsubscribe()
                        resolve(tx)
                    }
                }
            )
        } catch (err) {
            reject({ message: err.message })
        }
    })
}

// Withdraw Chips and return them as Tokens to the Wallet
async function withdrawChips(amount, slotsContract) {
    return new Promise(async (resolve, reject) => {
        try {
            slotsContract
                .logWithdraw()
                .then(data => {
                    resolve(data)
                })
                .catch(e => reject({ message: e.message }))
            await slotsContract.withdraw(amount)
            // helper.toggleSnackbar('Successfully sent withdraw transaction')
        } catch (err) {
            reject({ message: 'Error sending withdraw tx' })
        }
    })
}

/**
 * Allows users to claim DBETs from a closed channel
 * @param {number} channelId
 * @param {any} slotsContract
 */
async function claimChannel(channelId: number, slotsContract: any) {
    return new Promise(async (resolve, reject) => {
        try {
            slotsContract
                .logClaimChannelTokens(channelId)
                .then(({ id, isHouse }) => {
                    resolve({ id, isHouse })
                })
                .catch(e => reject({ message: e.message }))
            await slotsContract.claim(channelId)
        } catch (e) {
            reject({ message: e.message })
        }
    })
}

async function fetchAesKey(channelId, channelNonce, utils) {
    return new Promise(async (resolve, reject) => {
        try {
            let key = await utils.getAesKey(channelNonce)
            resolve({ channelId, channelNonce, key })
        } catch (error) {
            reject({ message: error.message })
        }
    })
}

function getChannelNonce(channelId, contractFactory) {
    return new Promise(async (resolve, reject) => {
        try {
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            let channelNonce = await slotsContract.getChannelNonce(channelId)
            resolve(channelNonce)
        } catch (e) {
            console.error('Error channel ', e)
            reject({ message: 'Error retrieving channel nonce' })
        }
    })
}

/**
 * The Basic information of a State Channel
 * @param channelId
 * @param contract
 */
function getChannelInfo(channelId, contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await contract.getChannelInfo(channelId)
            const playerAddress = info[0]
            const result = {
                playerAddress,
                ready: info[1],
                activated: info[2],
                finalized: info[3],
                initialDeposit: info[4],
                finalNonce: info[5],
                endTime: toDate(info[6]),
                exists: playerAddress === '0x0'
            }
            resolve(result)
        } catch (error) {
            reject({ message: 'Error retrieving channel details' })
        }
    })
}

/**
 * Get the player's house address
 * @param channelId
 * @param contractFactory
 */
function getAuthorizedAddress(channelId, contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const player = await contract.getPlayer(channelId, true)
            resolve(player)
        } catch (error) {
            reject({ message: 'Error retrieving house authorized address' })
        }
    })
}

/**
 * Is the channel closed?
 * @param channelId
 * @param contractFactory
 */
function isChannelClosed(channelId, contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const isClosed = await contract.isChannelClosed(channelId)
            resolve(isClosed)
        } catch (err) {
            reject({ message: 'Error retrieving is channel closed' })
        }
    })
}

/**
 * Get the other channel hashes
 * @param {number} id
 * @param {any} contract
 */
function getChannelHashes(id, contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const hashes = await contract.getChannelHashes(id)
            const result = {
                finalUserHash: hashes[0],
                initialUserNumber: hashes[1],
                finalReelHash: hashes[2],
                finalSeedHash: hashes[3]
            }
            resolve(result)
        } catch (err) {
            reject({ message: 'Error retrieving channel hashes' })
        }
    })
}

function getDeposited(channelId, isHouse = false, contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const rawBalance = await contract.channelDeposits(
                channelId,
                isHouse
            )
            const deposited = new BigNumber(rawBalance)
            resolve(deposited)
        } catch (error) {
            reject({ message: error.message })
        }
    })
}

function getFinalBalances(channelId, isHouse = false, contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const balance = await contract.finalBalances(channelId, isHouse)
            const finalbalance = new BigNumber(balance)
            resolve(finalbalance)
        } catch (error) {
            reject({ message: error.message })
        }
    })
}

/**
 * Get info and hashes required to interact with an active channel
 * @param id
 * @param contractFactory
 */
function getChannelDetails(id, contractFactory) {
    return new Promise(async (resolve, reject) => {
        try {
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
                getChannelInfo(id, contract),
                getAuthorizedAddress(id, contract),
                isChannelClosed(id, contract),
                getChannelHashes(id, contract)
            ])

            const result = {
                deposited,
                finalBalances,
                channelId: id,
                info,
                houseAuthorizedAddress,
                closed,
                hashes
            }

            resolve(result)
        } catch (error) {
            reject({ message: 'Error getting channel details' })
        }
    })
}

/**
 * Loads the last spin for an active channel
 * @param id
 * @param channelNonce
 * @param hashes
 * @param aesKey
 * @param wsApi
 * @param utils
 */
function loadLastSpin(id, channelNonce, hashes, aesKey, wsApi, utils) {
    return new Promise(async (resolve, reject) => {
        try {
            let result
            try {
                result = await wsApi.getLastSpin(id)
                result = result.res
            } catch (e) {
                result = {
                    userSpin: null,
                    houseSpin: null,
                    nonce: 0
                }
            }

            let encryptedSpin = result.userSpin
            let houseSpin = result.houseSpin
            let nonce = result.nonce ? result.nonce + 1 : 1
            let userSpin, houseSpins
            if (encryptedSpin) {
                try {
                    let rawSpinData = AES.decrypt(encryptedSpin, aesKey)
                    userSpin = JSON.parse(
                        rawSpinData.toString(CryptoJs.enc.Utf8)
                    )
                } catch (e) {
                    throw e
                }
            }
            if (houseSpin) {
                houseSpins = [houseSpin]
            } else {
                houseSpins = []
            }

            let initialUserNumber = AES.decrypt(
                hashes.initialUserNumber,
                aesKey
            ).toString(CryptoJs.enc.Utf8)
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

            resolve({
                nonce,
                houseSpins,
                userHashes,
                userSpin
            })
        } catch (error) {
            reject({ message: 'Error getting the loading spin' })
        }
    })
}

function getLastSpin(channelId, channelNonce, contractFactory, wsApi, utils) {
    return new Promise(async (resolve, reject) => {
        try {
            let contract = await contractFactory.slotsChannelManagerContract()
            let aesKey = await utils.getAesKey(channelNonce)
            let hashes = await getChannelHashes(channelId, contract)
            let data: any = await loadLastSpin(
                channelId,
                channelNonce,
                hashes,
                aesKey,
                wsApi,
                utils
            )

            resolve({
                channelId,
                nonce: data.nonce,
                houseSpins: data.houseSpins,
                userHashes: data.userHashes,
                lastSpinLoaded: true
            })
        } catch (error) {
            reject({ message: 'Error getting the last spin.' })
        }
    })
}

/**
 * Gets a single channel's data
 * @param {string} channelId
 * @param channelNonce
 * @param wsApi
 * @param helper
 * @param utils
 */
function getChannel(
    channelId: string,
    channelNonce,
    contractFactory,
    wsApi,
    utils
) {
    return new Promise(async (resolve, reject) => {
        try {
            let channelDetails: any = await getChannelDetails(
                channelId,
                contractFactory
            )
            let lastSpin
            if (
                channelDetails &&
                channelDetails.info &&
                channelDetails.info.activated
            )
                lastSpin = await getLastSpin(
                    channelId,
                    channelNonce,
                    contractFactory,
                    wsApi,
                    utils
                )

            resolve({
                ...channelDetails,
                ...lastSpin
            })
        } catch (error) {
            reject({ message: 'Error getting the channel' })
        }
    })
}

/**
 * Get all channels for a user
 */
function getChannels(contractFactory, wsApi, utils) {
    return new Promise(async (resolve, reject) => {
        try {
            const topRequests = 1
            let totalRequests = 0
            const contract = await contractFactory.slotsChannelManagerContract()

            // get the subscription
            const getChannels$ = contract.getEventSubscription(
                contract.getChannels()
            )

            const channels$ = getChannels$.pipe(
                tap(() => {
                    totalRequests++
                }),
                map((i: any) => {
                    return i.map(event =>
                        getChannel(
                            event.returnValues.id,
                            event.returnValues.channelNonce,
                            contractFactory,
                            wsApi,
                            utils
                        )
                    )
                })
            )
            console.log('channels$', channels$)

            const subs = channels$.subscribe(
                async items => {
                    if (items.length >= 1 || totalRequests >= topRequests) {
                        subs.unsubscribe() // stop making requests
                        let resolved = await Promise.all(items) // get all channels info

                        // convert into an object because all the components and reducers
                        // are wating for this kind of structure
                        const result = resolved.reduce((mem, channel: any) => {
                            mem[channel.channelId] = channel
                            return mem
                        }, {})

                        resolve(result)
                    }
                },
                reason => reject({ message: reason.message })
            )
        } catch (e) {
            return reject({ message: e.message })
        }
    })
}

/**
 * Subscribe to spin responses from websockets API
 * @param listener
 * @param wsApi
 * @param slotsChannelHandler
 */
async function subscribeToSpinResponses(listener, wsApi, slotsChannelHandler) {
    wsApi.getProcessSpinResponseSubscription(
        null,
        async ({ req, res }) => {
            try {
                if (res.error) {
                    throw new Error(res.message ? res.message : res.error)
                }

                let houseSpin = res.message
                let userSpin = req.spin
                let lines = slotsChannelHandler.getLines(res.message.reel)
                listener(null, res.message, houseSpin, userSpin, lines)
            } catch (e) {
                listener(true, e.message)
            }
        },
        true
    )
}

/**
 * Subscribe to finalize responses from websockets API
 * @param listener
 * @param wsApi
 */
async function subscribeToFinalizeResponses(listener, wsApi) {
    wsApi.getFinalizeChannelResponseSubscription(
        null,
        async ({ req, res }) => {
            try {
                if (res.error) {
                    throw new Error(res.message ? res.message : res.error)
                }
                listener(null, res.message)
            } catch (e) {
                listener(true, e.message)
            }
        },
        true
    )
}

/**
 * Finalizes a channel allowing users to claim DBETs
 * @param {number} channelId
 * @param {Object} state
 * @param {Object} injectedDependencies
 */
function finalizeChannel(channelId, state, contractFactory, wsApi, utils) {
    return new Promise(async (resolve, reject) => {
        let aesKey = state.aesKey
        try {
            let betSize = utils.convertToEther(1)

            let userSpin = await utils.getSpin(betSize, state, true)
            let lastHouseSpin
            let txHash
            let contract = await contractFactory.slotsChannelFinalizerContract()
            // If the user nonce is 0
            // this would mean that there haven't been any spin performed within the channel.
            if (userSpin.nonce === 0) {
                txHash = await contract.finalizeZeroNonce(channelId, userSpin)
            } else {
                lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
                txHash = await contract.finalize(
                    channelId,
                    userSpin,
                    lastHouseSpin
                )
            }
            /**
             * After sending a finalize channel tx on the Ethereum network let the state channel API know that
             * the transaction was sent to make sure future spins aren't processed.
             */

            await wsApi.finalizeChannel(channelId, userSpin, aesKey)
            resolve(txHash)
        } catch (err) {
            reject({ message: 'Error sending finalize channel transaction' })
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_AES_KEY]: fetchAesKey,
        [Actions.GET_CHANNEL]: getChannel,
        [Actions.GET_CHANNEL_NONCE]: getChannelNonce,
        [Actions.GET_CHANNELS]: getChannels,
        [Actions.APPROVE]: approve,
        [Actions.INIT_CHANNEL]: initChannel,
        [Actions.CREATE_CHANNEL]: createChannel,
        [Actions.DEPOSIT_TO_CHANNEL]: depositToChannel,
        [Actions.DEPOSIT_CHIPS]: depositChips,
        [Actions.GET_ALLOWANCE]: fetchAllowance,
        [Actions.WAIT_FOR_CHANNEL_ACTIVATION]: waitForChannelActivation,
        [Actions.SUBSCRIBE_TO_SPIN_RESPONSES]: subscribeToSpinResponses,
        [Actions.SUBSCRIBE_TO_FINALIZE_RESPONSES]: subscribeToFinalizeResponses,
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
