import Bluebird from 'bluebird'
import cryptoJs, { AES } from 'crypto-js'
import { createActions } from 'redux-actions'
import DecentAPI from '../../../Components/Base/DecentAPI'
import Actions, { PREFIX } from './actionTypes'
import { getAesKey, getUserHashes } from '../functions'
import BigNumber from 'bignumber.js'
import moment from 'moment'

const decentApi = new DecentAPI()

async function fetchAesKey(channelId, chainProvider) {
    let key = getAesKey(channelId, chainProvider)
    return Promise.resolve({ channelId, key })
}

/**
 * The Basic information of a State Channel
 * @param channelId
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
 * @param id
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
 * @param {number} id
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
 */
async function getChannelHashes(id, { contractFactory }) {
    try {
        const contract = contractFactory.slotsChannelManagerContract()
        const hashes = await contract.getChannelHashes(id)
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
    const contract = contractFactory.slotsChannelManagerContract()
    const rawBalance = await contract.channelDeposits(channelId, isHouse)
    return new BigNumber(rawBalance)
}

/**
 * Get info and hashes required to interact with an active channel
 * @param id
 */
async function getChannelDetails(id, chainProvider) {
    return Bluebird.props({
        deposited: getDeposited(id, false, chainProvider),
        channelId: id,
        info: getChannelInfo(id, chainProvider),
        houseAuthorizedAddress: getAuthorizedAddress(id, chainProvider),
        closed: isChannelClosed(id, chainProvider),
        hashes: getChannelHashes(id, chainProvider)
    })
}

/**
 * Loads the last spin for an active channel
 * @param id
 * @param hashes
 * @param aesKey
 */
async function loadLastSpin(id, hashes, aesKey) {
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

    let initialUserNumber = AES.decrypt(
        hashes.initialUserNumber,
        aesKey
    ).toString(cryptoJs.enc.Utf8)
    let userHashes = await getUserHashes(initialUserNumber)
    let isValid = userHashes[userHashes.length - 1] === hashes.finalUserHash

    if (!isValid) throw new Error('Invalid initial User Number')
    return {
        nonce: nonce,
        houseSpins: houseSpins,
        userHashes: userHashes,
        userSpin: userSpin
    }
}

async function getLastSpin(channelId, chainProvider) {
    let aesKey = await getAesKey(channelId, chainProvider)
    let { hashes } = await getChannelDetails(channelId, chainProvider)
    let data = await loadLastSpin(channelId, hashes, aesKey)

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
 */
async function getChannel(channelId, chainProvider) {
    // Execute both actions in parallel
    const data = await Bluebird.props({
        channelDetails: getChannelDetails(channelId, chainProvider),
        lastSpin: getLastSpin(channelId, chainProvider)
    })
    return {
        ...data.channelDetails,
        ...data.lastSpin
    }
}

/**
 * Get all channels for a user
 */
async function getChannels(chainProvider) {
    const { contractFactory } = chainProvider
    const contract = await contractFactory.slotsChannelManagerContract()
    let channelCount = await contract.getChannelCount()
    const accumulator = {}

    if (channelCount > 0) {
        const list = await contract.getChannels()
        for (const iterator of list) {
            // Query every channel and accumulate it
            const id = iterator.returnValues.id
            // Add promise itself into the array.
            const resultPromise = getChannel(id, chainProvider)
            accumulator[id] = resultPromise
        }
    } 
    // Execute all promises simultaneously.
    return Bluebird.props(accumulator)
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
