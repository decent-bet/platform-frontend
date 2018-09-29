import ethUtil from "ethereumjs-util"
import { SHA256 } from 'crypto-js'
import EventBus from 'eventing-bus'
import ethUnits from 'ethereum-units'
import BigNumber from 'bignumber.js'

const initialChannelHouseBalance = new BigNumber(10).pow(18).times(10000)
/**
 * Utils class for common use
 */

export default class Utils {


    constructor() {}

    /** Solidity ecsign implementation */
    public static signString = async (text, keyHandler) => {
        /*
         * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the user's address;
         */
        return new Promise(async (resolve, reject) => {
            let msgHash = ethUtil.sha3(text)
            let { privateKey } = await keyHandler.get()
            privateKey = ethUtil.toBuffer(privateKey)
            let defaultAccount = keyHandler.getAddress()
            console.log('Signing', text, ethUtil.bufferToHex(msgHash), 'as', defaultAccount,
                ethUtil.isValidPrivate(privateKey))

            const {v, r, s} = ethUtil.ecsign(msgHash, privateKey)
            const sgn = ethUtil.toRpcSig(v, r, s)

            console.log('v: ' + v + ', r: ' + sgn.slice(0, 66) + ', s: 0x' + sgn.slice(66, 130))

            let m = ethUtil.toBuffer(msgHash)
            let pub = ethUtil.ecrecover(m, v, r, s)
            let adr = '0x' + ethUtil.pubToAddress(pub).toString('hex')

            console.log('Generated sign address', adr, defaultAccount)

            console.log('Generated msgHash', msgHash, 'Sign', sgn)
            let address = keyHandler.getAddress()
            if (address && adr !== address.toLowerCase())
                reject(new Error("Invalid address for signed message"))

            resolve({msgHash, sig: sgn})
        })
    }

    public static getUserHashes(randomNumber) {
        let lastHash
        let hashes: string[] = []
        for (let i = 0; i < 1000; i++) {
            let hash = SHA256(i === 0 ? randomNumber : lastHash).toString()
            hashes.push(hash)
            lastHash = hash
        }
        return hashes
    }

    public static random(length) {
        let randomValuesArray = new Uint32Array(length)
        window.crypto.getRandomValues(randomValuesArray)
    
        let outputString = ""
        // tslint:disable-next-line:prefer-for-of
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
    public static verifySign(msg: string, sign: string, address: string) {
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
     * @param {any} state
     * @param {Boolean} finalize
     */
    public static async getSpin(betSize: BigNumber, state: any, finalize: boolean, keyHandler: any) {
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
            reelHash,
            reel,
            reelSeedHash,
            prevReelSeedHash,
            userHash,
            prevUserHash,
            nonce: spinNonce,
            turn: false,
            userBalance,
            houseBalance,
            betSize,
            sign: null
        }
        console.log('getSpin', spin)

        let packedString = Utils.getTightlyPackedSpin(spin)
        let sign: any = await Utils.signString(packedString, keyHandler)
        spin.sign = sign.sig

        return spin
    }

    /**
     * Returns a tightly packed spin string
     * @param spin
     */
    public static getTightlyPackedSpin(spin) {
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
    
    public static getTimestamp() {
        return Utils.getTimestampInMillis() / 1000
    }

    public static getTimestampInMillis = () => {
        return Math.round(new Date().getTime())
    }

    public static getEtherInWei = () => {
        return ethUnits.units.ether
    }

    public static convertToEther = number => {
        return new BigNumber(number).times(Utils.getEtherInWei()).toFixed(0)
    }

    public static formatEther = ether => {
        return new BigNumber(ether).dividedBy(Utils.getEtherInWei()).toFixed(2)
    }

    public static roundDecimals = (number, decimals) => {
        // tslint:disable-next-line:no-bitwise
        let multiplier = 10 ^ decimals
        return Math.round(number * multiplier) / multiplier
    }

    public static capitalize = string => {
        return (
            string.substr(0, 1).toUpperCase() +
            string.substring(1, string.length + 1)
        )
    }

    public static isUndefined = object => {
        return typeof object === 'undefined'
    }

    public static duplicate = obj => {
        return JSON.parse(JSON.stringify(obj))
    }

    public static commafy = number => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    public static toggleSnackbar = message => {
        EventBus.publish('showSnackbar', message)
    }
}
