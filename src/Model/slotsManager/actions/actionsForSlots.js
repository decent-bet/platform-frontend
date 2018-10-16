import CryptoJs, { AES } from 'crypto-js'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { tap, map } from 'rxjs/operators'

async function fetchAesKey(channelId, channelNonce, utils) {
    let key = await utils.getAesKey(channelNonce)
    return { channelId, channelNonce, key }
}

async function getChannelNonce(channelId, contractFactory, helper) {
    try {
        let slotsContract = await contractFactory.slotsChannelManagerContract()
        let channelNonce = await slotsContract.getChannelNonce(channelId)
        return channelNonce
    } catch (e) {
        helper.toggleSnackbar('Error retrieving channel nonce')
        console.log('Error retrieving channel nonce', e.message)
    }
}

/**
 * The Basic information of a State Channel
 * @param channelId
 * @param contract
 * @param helper
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
            endTime: moment(info[6]),
            exists: playerAddress === '0x0'
        }
    } catch (error) {
        helper.toggleSnackbar('Error retrieving channel details')
        console.log('Error retrieving channel details', error.message)
    }
}

/**
 * Get the player's house address
 * @param channelId
 * @param contract
 * @param helper
 */
async function getAuthorizedAddress(channelId, contract, helper) {
    try {
        return await contract.getPlayer(channelId, true)
    } catch (error) {
        helper.toggleSnackbar('Error retrieving house authorized address')
        console.log('Error retrieving house authorized address', error.message)
    }
}

/**
 * Is the channel closed?
 * @param channelId
 * @param contract
 * @param helper
 */
async function isChannelClosed(channelId, contract, helper) {
    try {
        return await contract.isChannelClosed(channelId)
    } catch (err) {
        helper.toggleSnackbar('Error retrieving is channel closed')
        console.log('Error retrieving is channel closed', err.message)
    }
}

/**
 * Get the other channel hashes
 * @param {number} id
 * @param {Object} contract
 * @param helper
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
        helper.toggleSnackbar('Error retrieving channel hashes')
        console.log('Error retrieving channel hashes', err.message)
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
 * @param contractFactory
 * @param helper
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
 * @param channelNonce
 * @param hashes
 * @param aesKey
 * @param wsApi
 * @param utils
 */
async function loadLastSpin(id, channelNonce, hashes, aesKey, wsApi, utils) {
    let result
    try {
        result = await wsApi.getLastSpin(id)
        result = result.res
    } catch (e) {
        result = {
            userSpin: null,
            houseSpin: null,
            nonce: 0,
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
            userSpin = JSON.parse(rawSpinData.toString(CryptoJs.enc.Utf8))
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

    return {
        nonce: nonce,
        houseSpins: houseSpins,
        userHashes: userHashes,
        userSpin: userSpin
    }
}

async function getLastSpin(channelId, channelNonce, chainProvider, wsApi, helper, utils ) {
    let { contractFactory } = chainProvider
    let contract = await contractFactory.slotsChannelManagerContract()
    let aesKey = await utils.getAesKey(channelNonce)
    let hashes = await getChannelHashes(channelId, contract, helper)
    let data = await loadLastSpin(channelId, channelNonce, hashes, aesKey, wsApi, utils)
    console.log('getLastSpin', {aesKey, hashes, data})

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
 * @param channelNonce
 * @param chainProvider
 * @param wsApi
 * @param helper
 * @param utils
 */
async function getChannel(channelId, channelNonce, chainProvider, wsApi, helper, utils) {
    // Execute both actions in parallel
    console.log('getChannel', channelId, channelNonce)
    let { contractFactory } = chainProvider
    let channelDetails = await getChannelDetails(channelId, contractFactory, helper)
    console.log('getChannel', channelDetails)
    let lastSpin
    if (channelDetails &&
        channelDetails.info &&
        channelDetails.info.activated)
        lastSpin = await getLastSpin(channelId, channelNonce, chainProvider, wsApi, helper, utils)

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
function getChannels(chainProvider, wsApi, helper, utils) {
    return new Promise(async (resolve, reject) => {
        try {
            const topRequests = 1
            let totalRequests = 0
            const { contractFactory } = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()

            //get the subscription
            const getChannels$ = contract.getEventSubscription(
                contract.getChannels()
            )

            const channels$ = getChannels$.pipe(
                tap( () => {
                    totalRequests++
                }),
                tap(logChannels('BEFORE mergeMap -----------')),
                map(i => {
                    console.log('ON MERGE MAP', i)
                    return i.map(event =>
                        getChannel(event.returnValues.id, event.returnValues.channelNonce, chainProvider, wsApi, helper, utils)
                    )
                })
            )
            console.log('channels$', channels$)

            const subs = channels$.subscribe(async items => {
                console.log('channels$.subscribe', items)
                if (items.length >= 1 || totalRequests >= topRequests) {
                    subs.unsubscribe() //stop making requests
                    let resolved = await Promise.all(items) //get all channels info
                    console.log('channels$.subscribe resolved', resolved)

                    //convert into an object because all the components and reducers
                    //are wating for this kind of structure
                    const result = resolved.reduce((mem, channel) => {
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
 * Subscribe to spin responses from websockets API
 * @param listener
 * @param wsApi
 * @param slotsChannelHandler
 */
async function subscribeToSpinResponses(listener, wsApi, slotsChannelHandler) {
    wsApi.getProcessSpinResponseSubscription(null, async ({req, res}) => {
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
    }, true)
}

/**
 * Subscribe to finalize responses from websockets API
 * @param listener
 * @param wsApi
 */
async function subscribeToFinalizeResponses(listener, wsApi) {
    wsApi.getFinalizeChannelResponseSubscription(null, async ({req, res}) => {
        try {
            if (res.error) {
                throw new Error(res.message ? res.message : res.error)
            }
            listener(null, res.message)
        } catch (e) {
            listener(true, e.message)
        }
    }, true)
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_AES_KEY]: fetchAesKey,
        [Actions.GET_CHANNEL]: getChannel,
        [Actions.GET_CHANNELS]: getChannels,
        [Actions.GET_CHANNEL_NONCE]: getChannelNonce,
        [Actions.GET_CHANNEL_DETAILS]: getChannelDetails,
        [Actions.GET_LAST_SPIN]: getLastSpin,
        [Actions.SUBSCRIBE_TO_SPIN_RESPONSES]: subscribeToSpinResponses,
        [Actions.SUBSCRIBE_TO_FINALIZE_RESPONSES]: subscribeToFinalizeResponses,
        [Actions.NONCE_INCREASE]: channelId => ({ channelId }),
        [Actions.POST_SPIN]: (channelId, spin) => ({ ...spin, channelId })
    }
})
