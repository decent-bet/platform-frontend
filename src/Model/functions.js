import KeyHandler from '../Components/Base/KeyHandler'
import Helper from '../Components/Helper'
import cryptoJs, { SHA256 } from 'crypto-js'

const keyHandler = new KeyHandler()
const helper = new Helper()

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

function random(length) {
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
    let initialUserNumber = cryptoJs.AES.encrypt(randomNumber, key).toString()
    let userHashes = await getUserHashes(randomNumber)
    let finalUserHash = userHashes[userHashes.length - 1]
    return {
        initialUserNumber: initialUserNumber,
        finalUserHash: finalUserHash
    }
}
