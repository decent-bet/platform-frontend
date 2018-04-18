import KeyHandler from '../../Components/Base/KeyHandler'
import Helper from '../../Components/Helper'
import { SHA256, AES } from 'crypto-js'
import DecentAPI from '../../Components/Base/DecentAPI'
import BigNumber from 'bignumber.js'

const keyHandler = new KeyHandler()
const helper = new Helper()
const decentAPI = new DecentAPI()

export function getAesKey(id) {
    const web3 = helper.getWeb3()
    const idHash = web3.utils.sha3(id)
    const idHashHex = web3.utils.utf8ToHex(idHash)
    const aesKey = web3.eth.accounts.sign(idHashHex, keyHandler.get()).signature
    return aesKey
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
    return Math.floor(
        Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    )
}

/**
 * Returns parameters required to call the depositToChannel function - initialRandomNumber and finalUserHash
 *
 * Initial User Number is generated using an 18 digit random number which's AES-256 encrypted with a key that is
 * a SHA3 of the channel id signed with the user's account
 *
 *
 * @param id
 * @param callback
 */
export async function getChannelDepositParams(id, callback) {
    let randomNumber = random(18).toString()

    const key = getAesKey(id)
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
 */
export async function getSpin(betSize, state) {
    const lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
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
        nonce === 1 ? state.info.initialDeposit : lastHouseSpin.houseBalance
    houseBalance = new BigNumber(houseBalance).toFixed(0)

    let spin = {
        reelHash: reelHash,
        reel: reel,
        reelSeedHash: reelSeedHash,
        prevReelSeedHash: prevReelSeedHash,
        userHash: userHash,
        prevUserHash: prevUserHash,
        nonce: nonce,
        turn: false,
        userBalance: userBalance,
        houseBalance: houseBalance,
        betSize: betSize
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
