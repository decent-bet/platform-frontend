import Bluebird from 'bluebird'
import cryptoJs, { AES } from 'crypto-js'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { tap, map } from 'rxjs/operators'

async function fetchAesKey(channelId, utils) {
    let key = await utils.getAesKey(channelId)
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
 * @param contractFactory
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
 * @param contractFactory
 */
async function isChannelClosed(channelId, contract) {
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
        result = await Bluebird.fromCallback(cb =>
            httpApi.getLastSpin(id, cb)
        )
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
        nonce: nonce,
        houseSpins: houseSpins,
        userHashes: userHashes,
        userSpin: userSpin
    }
}

async function getLastSpin(channelId, chainProvider, httpApi, helper, utils ) {
    let { contractFactory } = chainProvider
    let contract = await contractFactory.slotsChannelManagerContract()
    console.log('getLastSpin', channelId)
    let aesKey = await utils.getAesKey(channelId)
    let hashes = await getChannelHashes(channelId, contract, helper)
    let data = await loadLastSpin(channelId, hashes, aesKey, httpApi, utils)
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
 * @param chainProvider
 */
async function getChannel(channelId, chainProvider, httpApi, helper, utils) {
    // Execute both actions in parallel
    console.log('getChannel', channelId)
    let { contractFactory } = chainProvider
    let channelDetails = await getChannelDetails(channelId, contractFactory, helper)
    console.log('getChannel', channelDetails)
    let lastSpin
    if (channelDetails &&
        channelDetails.info &&
        channelDetails.info.activated)
        lastSpin = await getLastSpin(channelId, chainProvider, httpApi, helper, utils)

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

            //get the subscription
            const getChannels$ = contract.getEventSubscription(
                contract.getChannels()
            )

            const channels$ = getChannels$.pipe(
                tap( _ => {
                    totalRequests++
                }),
                tap(logChannels('BEFORE mergeMap -----------')),
                map(i => {
                    console.log('ON MERGE MAP', i)
                    return i.map(event =>
                        getChannel(event.returnValues.id, chainProvider, httpApi, helper, utils)
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

export default createActions({
    [PREFIX]: {
        [Actions.GET_AES_KEY]: fetchAesKey,
        [Actions.GET_CHANNEL]: getChannel,
        [Actions.GET_CHANNELS]: getChannels,
        [Actions.GET_CHANNEL_DETAILS]: getChannelDetails,
        [Actions.GET_LAST_SPIN]: getLastSpin,
        [Actions.NONCE_INCREASE]: channelId => ({ channelId }),
        [Actions.POST_SPIN]: (channelId, spin) => ({ ...spin, channelId })
    }
})
