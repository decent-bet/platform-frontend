import Bluebird from 'bluebird'
import cryptoJs, { AES } from 'crypto-js'
import { createActions } from 'redux-actions'
import DecentAPI from '../../Components/Base/DecentAPI'
import Helper from '../../Components/Helper'
import Actions, { PREFIX } from './actionTypes'
import { getAesKey, getUserHashes } from './functions'
import BigNumber from 'bignumber.js'

const helper = new Helper()
const decentApi = new DecentAPI()

async function fetchAesKey(channelId) {
    let key = getAesKey(channelId)
    return Promise.resolve({ channelId, key })
}

/**
 * The Basic information of a State Channel
 * @param channelId
 */
async function getChannelInfo(channelId) {
    try {
        const instance = helper.getContractHelper().SlotsChannelManager
        const info = await instance.getChannelInfo(channelId)
        const playerAddress = info[0]
        return {
            playerAddress,
            ready: info[1],
            activated: info[2],
            initialDeposit: info[4],
            finalized: info[3],
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
async function getAuthorizedAddress(channelId) {
    try {
        const instance = helper.getContractHelper().SlotsChannelManager
        return instance.getPlayer(channelId, true)
    } catch (error) {
        console.log('Error retrieving house authorized address', error.message)
    }
}

/**
 * Is the channel closed?
 * @param {number} id
 */
async function isChannelClosed(channelId) {
    try {
        const instance = helper.getContractHelper().SlotsChannelManager
        return instance.isChannelClosed(channelId)
    } catch (err) {
        console.log('Error retrieving is channel closed', err.message)
    }
}

/**
 * Get the other channel hashes
 * @param {number} id
 */
async function getChannelHashes(id) {
    try {
        const instance = helper.getContractHelper().SlotsChannelManager
        const hashes = await instance.getChannelHashes(id)
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

async function getDeposited(channelId, isHouse = false) {
    const instance = helper.getContractHelper().SlotsChannelManager
    const rawBalance = await instance.channelDeposits(channelId, isHouse)
    return new BigNumber(rawBalance)
}

/**
 * Get info and hashes required to interact with an active channel
 * @param id
 */
async function getChannelDetails(id) {
    return Bluebird.props({
        deposited: getDeposited(id),
        channelId: id,
        info: getChannelInfo(id),
        houseAuthorizedAddress: getAuthorizedAddress(id),
        closed: isChannelClosed(id),
        hashes: getChannelHashes(id)
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
        } catch (e) {}
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

async function getLastSpin(channelId) {
    let aesKey = await getAesKey(channelId)
    let { hashes } = await getChannelDetails(channelId)
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
async function getChannel(channelId) {
    // Execute both actions in parallel
    const data = await Bluebird.props({
        channelDetails: getChannelDetails(channelId),
        lastSpin: getLastSpin(channelId)
    })
    return {
        ...data.channelDetails,
        ...data.lastSpin
    }
}

/**
 * Get all channels for a user
 */
async function getChannels() {
    const contract = helper.getContractHelper().SlotsChannelManager

    //Query a list of all channel ids
    const list = await contract.getChannels()
    const accumulator = {}
    for (const iterator of list) {
        // Query every channel and accumulate it
        const id = iterator.args.id
        const result = await getChannel(id)
        accumulator[id] = result
    }
    return accumulator
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
