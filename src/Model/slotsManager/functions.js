import { KeyHandler } from '../../Web3'
import { SHA256, AES } from 'crypto-js'
import DecentAPI from '../../Components/Base/DecentAPI'

const BigNumber = require('bignumber.js')

const keyHandler = new KeyHandler()
let decentAPI = null
const initialChannelHouseBalance = new BigNumber(10).pow(18).times(10000).toFixed()

export function getAesKey(id, { web3 }) {
    const idHash = web3.utils.soliditySha3(id)
    let privateKey = keyHandler.get()
    let sign = web3.eth.accounts.sign(idHash, privateKey)
    return sign.signature
}

export async function getUserHashes(randomNumber) {
    let lastHash
    let hashes = []
    for (let i = 0; i < 1000; i++) {
        let hash = SHA256(i === 0 ? randomNumber : lastHash).toString()
        hashes.push(hash)
        lastHash = hash
    }
    return hashes
}

export function random(length) {
    let randomValuesArray = new Uint32Array(length)
    let crypto = window.crypto || window.msCrypto
    crypto.getRandomValues(randomValuesArray)

    let outputString = "";
    for (let i = 0; i < randomValuesArray.length; i++) {
        outputString += randomValuesArray[i]
    }

    return outputString.slice(0, length)
}

/**
 * Returns parameters required to call the depositToChannel function - initialRandomNumber and finalUserHash
 *
 * Initial User Number is generated using an 18 digit random number which's AES-256 encrypted with a key that is
 * a SHA3 of the channel id signed with the user's account
 *
 *
 * @param id
 * @param chainProvider
 */
export async function getChannelDepositParams(id, chainProvider) {
    let randomNumber = random(18).toString()

    const key = getAesKey(id, chainProvider)
    let initialUserNumber = AES.encrypt(randomNumber, key).toString()
    let userHashes = await getUserHashes(randomNumber)
    let finalUserHash = userHashes[userHashes.length - 1]
    return {
        initialUserNumber: initialUserNumber,
        finalUserHash: finalUserHash
    }
}

/**
 * Executes a spin for the Slots
 * @param {BigNumber} betSize
 * @param {state} state
 * @param {Boolean} finalize
 */
export async function getSpin(betSize, state, finalize, chainProvider) {
    const lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
    const spinNonce = finalize ? (state.nonce === 1 ? 0 : state.nonce) : state.nonce
    const nonce = state.nonce

    let reelHash =
        nonce === 1 ? state.hashes.finalReelHash : lastHouseSpin.reelHash
    let reel = ''
    let reelSeedHash =
        nonce === 1 ? state.hashes.finalSeedHash : lastHouseSpin.reelSeedHash
    let prevReelSeedHash = nonce === 1 ? '' : lastHouseSpin.prevReelSeedHash
    let userHash = state.userHashes[state.userHashes.length - nonce]
    let prevUserHash = state.userHashes[state.userHashes.length - nonce - 1]
    let userBalance =
        nonce === 1 ? state.info.initialDeposit : lastHouseSpin.userBalance
    userBalance = new BigNumber(userBalance).toFixed(0)
    let houseBalance =
        nonce === 1 ? initialChannelHouseBalance : lastHouseSpin.houseBalance
    houseBalance = new BigNumber(houseBalance).toFixed(0)

    let spin = {
        reelHash: reelHash,
        reel: reel,
        reelSeedHash: reelSeedHash,
        prevReelSeedHash: prevReelSeedHash,
        userHash: userHash,
        prevUserHash: prevUserHash,
        nonce: spinNonce,
        turn: false,
        userBalance: userBalance,
        houseBalance: houseBalance,
        betSize: betSize
    }
    console.log('getSpin', spin)

    if(!decentAPI) {
        decentAPI = new DecentAPI(chainProvider.web3)
    }
    let packedString = getTightlyPackedSpin(spin)
    let sign = await decentAPI.signString(packedString)
    spin.sign = sign.sig

    return spin
}

/**
 * Returns a tightly packed spin string
 * @param spin
 */
export function getTightlyPackedSpin(spin) {
    return (
        spin.reelHash +
        (spin.reel !== '' ? spin.reel.toString() : '') +
        spin.reelSeedHash +
        spin.prevReelSeedHash +
        spin.userHash +
        spin.prevUserHash +
        spin.nonce +
        spin.turn +
        spin.userBalance +
        spin.houseBalance +
        spin.betSize
    )
}
