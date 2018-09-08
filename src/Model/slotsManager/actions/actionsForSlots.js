import Bluebird from 'bluebird'
import cryptoJs, { AES } from 'crypto-js'
import { createActions } from 'redux-actions'
import DecentAPI from '../../../Components/Base/DecentAPI'
import Actions, { PREFIX } from './actionTypes'
import { getAesKey, getUserHashes } from '../functions'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { zip, from, combineLatest, forkJoin } from 'rxjs'
import {
    filter,
    catchError,
    tap,
    map,
    mergeMap,
    concatAll,
    switchMap,
    timeout,
    takeWhile,
    every
} from 'rxjs/operators'

let decentApi = null

async function fetchAesKey(channelId, chainProvider) {
    let key = getAesKey(channelId, chainProvider)
    return Promise.resolve({ channelId, key })
}

/**
 * The Basic information of a State Channel
 * @param channelId
 * @param contractFactory
 */
async function getChannelInfo(channelId, { contractFactory }) {
    try {
        const contract = await contractFactory.slotsChannelManagerContract()
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
        console.log('Error retrieving channel details', error.message)
    }
}

/**
 * Get the player's house address
 * @param channelId
 * @param contractFactory
 */
async function getAuthorizedAddress(channelId, { contractFactory }) {
    try {
        const contract = await contractFactory.slotsChannelManagerContract()
        return await contract.getPlayer(channelId, true)
    } catch (error) {
        console.log('Error retrieving house authorized address', error.message)
    }
}

/**
 * Is the channel closed?
 * @param channelId
 * @param contractFactory
 */
async function isChannelClosed(channelId, { contractFactory }) {
    try {
        const contract = await contractFactory.slotsChannelManagerContract()
        return await contract.isChannelClosed(channelId)
    } catch (err) {
        console.log('Error retrieving is channel closed', err.message)
    }
}

/**
 * Get the other channel hashes
 * @param {number} id
 * @param contractFactory
 */
async function getChannelHashes(id, { contractFactory }) {
    try {
        const contract = await contractFactory.slotsChannelManagerContract()
        const hashes = await contract.getChannelHashes(id)
        console.log('Hashes', hashes, id)
        return {
            finalUserHash: hashes[0],
            initialUserNumber: hashes[1],
            finalReelHash: hashes[2],
            finalSeedHash: hashes[3]
        }
    } catch (err) {
        console.log('Error retrieving channel hashes', err.message)
    }
}

async function getDeposited(channelId, isHouse = false, { contractFactory }) {
    const contract = await contractFactory.slotsChannelManagerContract()
    const rawBalance = await contract.channelDeposits(channelId, isHouse)
    return new BigNumber(rawBalance)
}

/**
 * Get info and hashes required to interact with an active channel
 * @param id
 * @param chainProvider
 */
async function getChannelDetails(id, chainProvider) {
    let [
        deposited,
        info,
        houseAuthorizedAddress,
        closed,
        hashes
    ] = await Promise.all([
        getDeposited(id, false, chainProvider),
        getChannelInfo(id, chainProvider),
        getAuthorizedAddress(id, chainProvider),
        isChannelClosed(id, chainProvider),
        getChannelHashes(id, chainProvider)
    ])

    return {
        deposited,
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
async function loadLastSpin(id, hashes, aesKey, chainProvider) {
    if (!decentApi) {
        decentApi = new DecentAPI(chainProvider.web3)
    }

    let result = await Bluebird.fromCallback(cb =>
        decentApi.getLastSpin(id, cb)
    )
    let encryptedSpin = result.userSpin
    let houseSpin = result.houseSpin
    let nonce = result.nonce + 1
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
    let userHashes = getUserHashes(initialUserNumber)
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

async function getLastSpin(channelId, chainProvider) {
    console.log('getLastSpin', channelId)
    let aesKey = await getAesKey(channelId, chainProvider)
    let { hashes } = await getChannelDetails(channelId, chainProvider)
    let data = await loadLastSpin(channelId, hashes, aesKey, chainProvider)

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
async function getChannel(channelId, chainProvider) {
    // Execute both actions in parallel
    let [channelDetails, lastSpin] = await Promise.all([
        getChannelDetails(channelId, chainProvider),
        getLastSpin(channelId, chainProvider)
    ])

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
function getChannels(chainProvider) {
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
                tap(_ => {
                    totalRequests++
                }),
                tap(logChannels('BEFORE mergeMap -----------')),
                map(i => {
                    console.log('ON MERGE MAP', i)
                    return i.map(event =>
                        getChannel(event.returnValues.id, chainProvider)
                    )
                })
            )

            const subs = channels$.subscribe(async items => {
                if (items.length >= 1 || totalRequests >= topRequests) {
                    subs.unsubscribe() //stop making requests
                    let resolved = await Promise.all(items) //get all channels info

                    //convert into an object because all the components and reducers
                    //are wating for this kind of structure
                    const result = resolved.reduce((mem, channel) => {
                        mem[channel.channelId] = channel
                        return mem
                    }, {})

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
