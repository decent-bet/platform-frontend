const {
    cry,
    Transaction
} = require('thor-devkit')
import ethUtil from "ethereumjs-util"
import { SHA256, AES } from 'crypto-js'
const BigNumber = require('bignumber.js')

/**
 * Utils class for common use
 */
const initialChannelHouseBalance = new BigNumber(10).pow(18).times(10000)

export class Utils {

    constructor(chainProvider, keyHandler, wsApi) {
        this.chainProvider = chainProvider
        this.keyHandler = keyHandler
        this.wsApi = wsApi
    }

    async getAesKey(channelNonce) {
        const channelNonceHash = this.chainProvider.web3.utils.soliditySha3(channelNonce)
        let { privateKey } = await this.keyHandler.get()
        let sign = this.chainProvider.web3.eth.accounts.sign(channelNonceHash, privateKey)
        return sign.signature
    }

    getUserHashes(randomNumber) {
        let lastHash
        let hashes = []
        for (let i = 0; i < 1000; i++) {
            let hash = SHA256(i === 0 ? randomNumber : lastHash).toString()
            hashes.push(hash)
            lastHash = hash
        }
        return hashes
    }

    /**
     * Returns parameters required to call the depositToChannel function - initialRandomNumber and finalUserHash
     *
     * Initial User Number is generated using an 18 digit random number which's AES-256 encrypted with a key that is
     * a SHA3 of the channel id signed with the user's account
     *
     *
     * @param channelNonce
     */
    async getChannelDepositParams(channelNonce) {
        let randomNumber = this.random(18).toString()

        const key = await this.getAesKey(channelNonce)
        let initialUserNumber = AES.encrypt(randomNumber, key).toString()
        let userHashes = this.getUserHashes(randomNumber)
        let finalUserHash = userHashes[userHashes.length - 1]

        return {
            initialUserNumber: initialUserNumber,
            finalUserHash: finalUserHash
        }
    }

    random(length) {
        let randomValuesArray = new Uint32Array(length)
        let crypto = window.crypto || window.msCrypto
        crypto.getRandomValues(randomValuesArray)

        let outputString = ""
        for (let i = 0; i < randomValuesArray.length; i++) {
            outputString += randomValuesArray[i]
        }

        return outputString.slice(0, length)
    }

    /**
     * Verify a sign for the message sign and given address
     *
     * @param {string} msg
     * @param {string} sign
     * @param {string} address
     */
    verifySign(msg, sign, address) {
        let sigParams = ethUtil.fromRpcSig(sign)
        let msgHash = ethUtil.sha3(msg)

        let r = sigParams.r
        let s = sigParams.s
        let v = ethUtil.bufferToInt(sigParams.v)

        let publicKeyBuffer = ethUtil.ecrecover(msgHash, v, r, s)
        let publicKey = ethUtil.bufferToHex(publicKeyBuffer)
        publicKey = ethUtil.bufferToHex(ethUtil.pubToAddress(publicKey))

        console.log(
            'Verify sign - Public key',
            publicKey,
            address
        )

        return publicKey === address.toLowerCase()
    }

    /**
     * Executes a spin for the Slots
     * @param {BigNumber} betSize
     * @param {state} state
     * @param {Boolean} finalize
     */
    async getSpin(betSize, state, finalize) {
        const lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
        const spinNonce = finalize ? (state.nonce === 1 ? 0 : state.nonce) : state.nonce
        const nonce = state.nonce
        console.log('getSpin', betSize, lastHouseSpin, spinNonce, nonce)

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
        userBalance = new BigNumber(userBalance).toFixed()
        let houseBalance =
            nonce === 1 ? initialChannelHouseBalance : lastHouseSpin.houseBalance
        houseBalance = new BigNumber(houseBalance).toFixed()

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

        let packedString = this.getTightlyPackedSpin(spin)
        let sign = await this.wsApi.signString(packedString)
        spin.sign = sign.sig

        return spin
    }

    /**
     * Returns a tightly packed spin string
     * @param spin
     */
    getTightlyPackedSpin(spin) {
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

    async getTx(clauses, blockRef) {
        const {contractFactory} = this.chainProvider
        const chainTag = await contractFactory._web3.eth.getChainTag()
        const expiration = 32
        const gasPriceCoef = 0
        const gas = 1000000
        const nonce = 11111111
        let tx = new Transaction({
            chainTag,
            blockRef,
            expiration,
            clauses,
            gasPriceCoef,
            gas,
            nonce
        })
        let txHash = cry.blake2b256(tx.encode())
        let { privateKey } = await this.keyHandler.get()
        let privateKeyBuffer = Buffer.from(privateKey.replace('0x', ''), 'hex')
        tx.signature = cry.secp256k1.sign(txHash, privateKeyBuffer)

        txHash = txHash.toString('hex')
        let raw = tx.encode().toString('hex')
        let sign = tx.signature.toString('hex')
        let id = tx.id

        return {
            txHash,
            raw,
            sign,
            id
        }
    }
}
