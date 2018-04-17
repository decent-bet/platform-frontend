import { createActions } from 'redux-actions'
import DecentAPI from '../../Components/Base/DecentAPI'
import Bluebird from 'bluebird'
import Actions, { PREFIX } from './actionTypes'
import Helper from '../../Components/Helper'
import cryptoJs from 'crypto-js'
import { getUserHashes, getAesKey } from './functions'

const helper = new Helper()
const decentApi = new DecentAPI()

async function fetchAesKey(channelId) {
    let key = getAesKey(channelId)
    return Promise.resolve(key)
}

/**
 * The Basic information of a State Channel
 * @param id
 */
async function getChannelInfo(id) {
    try {
        let info = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .getChannelInfo(id)

        let playerAddress = info[0]
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
async function getAuthorizedAddress(id) {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .getPlayer(id, true)
    } catch (error) {
        console.log('Error retrieving house authorized address', error.message)
    }
}

/**
 * Is the channel closed?
 * @param {number} id
 */
async function isChannelClosed(id) {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .isChannelClosed(id)
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
        let hashes = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()
            .getChannelHashes(id)
        return {
            finalUserHash: hashes[0],
            initialUserNumber: hashes[1],
            initialHouseSeedHash: hashes[2],
            finalReelHash: hashes[3],
            finalSeedHash: hashes[4]
        }
    } catch (err) {
        console.log('Error retrieving channel hashes', err.message)
    }
}

/**
 * Get info and hashes required to interact with an active channel
 * @param id
 */
async function getChannelDetails(id) {
    return Bluebird.props({
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
 * @param callback
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
            let rawSpinData = cryptoJs.AES.decrypt(encryptedSpin, aesKey)
            userSpin = JSON.parse(rawSpinData.toString(cryptoJs.enc.Utf8))
        } catch (e) {}
    }
    if (houseSpin) {
        houseSpins = [houseSpin]
    } else {
        houseSpins = []
    }

    let initialUserNumber = cryptoJs.AES.decrypt(
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
        nonce: data.nonce,
        houseSpins: data.houseSpins,
        userHashes: data.userHashes,
        lastSpinLoaded: true
    }
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_AES_KEY]: fetchAesKey,
        [Actions.GET_CHANNEL_DETAILS]: getChannelDetails,
        [Actions.GET_LAST_SPIN]: getLastSpin,
        [Actions.NONCE_INCREASE]: () => {},
        [Actions.POST_SPIN]: spin => ({ ...spin })
    }
})
