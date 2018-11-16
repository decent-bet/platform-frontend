import * as ethUnits from 'ethereum-units'
import { IKeyHandler, IUtils, IThorifyFactory } from '../types'
import ethUtil from 'ethereumjs-util'
import BigNumber from 'bignumber.js'
import * as moment from 'moment'

const { cry, Transaction } = require('thor-devkit')

const initialChannelHouseBalance = new BigNumber(10).pow(18).times(10000)
/**
 * Utils class for common use
 */

export default class Utils implements IUtils {
    private _thorify = null
    constructor(
        private keyHandler: IKeyHandler,
        private thorifyFactory: IThorifyFactory
    ) {}

    private get thorify(): any {
        if (!this._thorify) {
            this._thorify = this.thorifyFactory.make()
        }

        return this._thorify
    }
    /** Solidity ecsign implementation */
    public async signString(text): Promise<any> {
        /*
         * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the user's address;
         */
        return new Promise(async (resolve, reject) => {
            let msgHash = ethUtil.sha3(text)
            let { privateKey } = await this.keyHandler.getWalletValues()
            privateKey = ethUtil.toBuffer(privateKey)
            let publicAddress = await this.keyHandler.getPublicAddress()
            console.log(
                'Signing',
                text,
                ethUtil.bufferToHex(msgHash),
                'as',
                publicAddress,
                ethUtil.isValidPrivate(privateKey)
            )

            const { v, r, s } = ethUtil.ecsign(msgHash, privateKey)
            const sgn = ethUtil.toRpcSig(v, r, s)

            console.log(
                'v: ' +
                    v +
                    ', r: ' +
                    sgn.slice(0, 66) +
                    ', s: 0x' +
                    sgn.slice(66, 130)
            )

            let m = ethUtil.toBuffer(msgHash)
            let pub = ethUtil.ecrecover(m, v, r, s)
            let adr = '0x' + ethUtil.pubToAddress(pub).toString('hex')

            console.log('Generated sign address', adr, publicAddress)

            console.log('Generated msgHash', msgHash, 'Sign', sgn)
            if (publicAddress && adr !== publicAddress.toLowerCase())
                reject(new Error('Invalid address for signed message'))

            resolve({ msgHash, sig: sgn })
        })
    }

    public async getAesKey(channelNonce) {
        const channelNonceHash = this.thorify.utils.soliditySha3(channelNonce)
        let { privateKey } = await this.keyHandler.getWalletValues()
        let sign = this.thorify.eth.accounts.sign(channelNonceHash, privateKey)
        return sign.signature
    }

    public async getChannelDepositParams(channelNonce): Promise<any> {
        let randomNumber = this.random(18)

        const key = await this.getAesKey(channelNonce)
        let cryptokey = await Utils.importKey(key)
        let initialUserNumber = await Utils.encryptAES(
            cryptokey,
            randomNumber
        ).toString()
        let userHashes = await this.getUserHashes(randomNumber)
        let finalUserHash = userHashes[userHashes.length - 1]

        return {
            initialUserNumber,
            finalUserHash
        }
    }

    public async getUserHashes(randomNumber: any): Promise<string[]> {
        let lastHash
        let hashes: string[] = []
        for (let i = 0; i < 1000; i++) {
            let hash = await Utils.sha256(
                i === 0 ? randomNumber : lastHash
            ).toString()
            hashes.push(hash)
            lastHash = hash
        }
        return hashes
    }

    public random(length): string {
        let randomValuesArray = new Uint32Array(length)
        window.crypto.getRandomValues(randomValuesArray)

        let outputString = ''
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
    public verifySign(msg: string, sign: string, address: string): boolean {
        let sigParams = ethUtil.fromRpcSig(sign)
        let msgHash = ethUtil.sha3(msg)

        let r = sigParams.r
        let s = sigParams.s
        let v = ethUtil.bufferToInt(sigParams.v)

        let publicKeyBuffer = ethUtil.ecrecover(msgHash, v, r, s)
        let publicKey = ethUtil.bufferToHex(publicKeyBuffer)
        publicKey = ethUtil.bufferToHex(ethUtil.pubToAddress(publicKey))

        console.log('Verify sign - Public key', publicKey, address)

        return publicKey === address.toLowerCase()
    }

    /**
     * Executes a spin for the Slots
     * @param {BigNumber} betSize
     * @param {any} state
     * @param {boolean} finalize
     */
    public async getSpin(
        betSize: BigNumber,
        state: any,
        finalize: boolean
    ): Promise<any> {
        const lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
        const spinNonce = finalize
            ? state.nonce === 1
                ? 0
                : state.nonce
            : state.nonce
        const nonce = state.nonce
        console.log('getSpin', betSize, lastHouseSpin, spinNonce, nonce)

        let reelHash =
            nonce === 1 ? state.hashes.finalReelHash : lastHouseSpin.reelHash
        let reel = ''
        let reelSeedHash =
            nonce === 1
                ? state.hashes.finalSeedHash
                : lastHouseSpin.reelSeedHash
        let prevReelSeedHash = nonce === 1 ? '' : lastHouseSpin.prevReelSeedHash
        let userHash = state.userHashes[state.userHashes.length - nonce]
        let prevUserHash = state.userHashes[state.userHashes.length - nonce - 1]
        let userBalance =
            nonce === 1 ? state.info.initialDeposit : lastHouseSpin.userBalance
        userBalance = new BigNumber(userBalance).toFixed()
        let houseBalance =
            nonce === 1
                ? initialChannelHouseBalance
                : lastHouseSpin.houseBalance
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

        let packedString = this.getTightlyPackedSpin(spin)
        let sign: any = await this.signString(packedString)
        spin.sign = sign.sig

        return spin
    }

    /**
     * Returns a tightly packed spin string
     * @param spin
     */
    public getTightlyPackedSpin(spin): any {
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

    public getTimestamp(): number {
        return this.getTimestampInMillis() / 1000
    }

    public getTimestampInMillis(): number {
        return Math.round(
            moment()
                .utc()
                .toDate()
                .getTime()
        )
    }

    public getEtherInWei(): any {
        return ethUnits.units.ether
    }

    public convertToEther(num): string {
        return new BigNumber(num).times(this.getEtherInWei()).toFixed(0)
    }

    public formatEther(ether): string {
        return new BigNumber(ether).dividedBy(this.getEtherInWei()).toFixed(2)
    }

    public roundDecimals(number, decimals): number {
        // tslint:disable-next-line:no-bitwise
        let multiplier = 10 ^ decimals
        return Math.round(number * multiplier) / multiplier
    }

    public capitalize(str): string {
        return str.substr(0, 1).toUpperCase() + str.substring(1, str.length + 1)
    }

    public isUndefined(object): boolean {
        return typeof object === 'undefined'
    }

    public duplicate(obj): any {
        return JSON.parse(JSON.stringify(obj))
    }

    public commafy(num): any {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    public async getTx(clauses, blockRef): Promise<any> {
        const chainTag = await this.thorify.eth.getChainTag()
        const expiration = 32
        const gasPriceCoef = 0
        const gas = 500000
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
        let { privateKey } = await this.keyHandler.getWalletValues()
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

    // References
    // https://github.com/diafygi/webcrypto-examples/#aes-gcm

    /**
     * Import passphrase key using AES-CBC 256
     * @param randomIV
     * @param passphraseKey
     */
    public static async importKey(passphraseKey: string) {
        const passphrase = new TextEncoder().encode(passphraseKey)
        const pwHash = await crypto.subtle.digest('SHA-256', passphrase)

        // TODO: IV needs to be random and shared
        const alg = { name: 'AES-CBC', iv: passphrase.slice(0, 8), length: 256 }
        return await crypto.subtle.importKey('raw', pwHash, alg, false, [
            'decrypt',
            'encrypt'
        ])
    }

    /**
     * Encrypts with AES-GCM
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    public static async encryptAES(key: CryptoKey, buffer: string) {
        const data: Uint8Array = new TextEncoder().encode(buffer)
        let encrypted = await window.crypto.subtle.encrypt(
            key.algorithm,
            key,
            data
        )

        return encrypted
    }

    /**
     * Decrypts with AES-GCM
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    public static async decryptAES(key: CryptoKey, buffer: string) {
        const data: Uint8Array = new TextEncoder().encode(buffer)
        let result = await window.crypto.subtle.decrypt(
            key.algorithm,
            key,
            data
        )

        return result
    }

    // References
    // https://gist.github.com/GaspardP/fffdd54f563f67be8944
    // https://github.com/diafygi/webcrypto-examples/#sha-256---digest

    // Computes the SHA-256 digest of a string with Web Crypto
    // Source: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    /**
     * Returns a SHA256 hash
     * @param str data
     */
    public static async sha256(str) {
        // Get the string as arraybuffer.
        const buffer = new TextEncoder().encode(str)
        const hash = await crypto.subtle.digest('SHA-256', buffer)
        return this.hex(hash)
    }

    public static hex(buffer) {
        let digest = ''
        const view = new DataView(buffer)
        for (let i = 0; i < view.byteLength; i += 4) {
            // We use getUint32 to reduce the number of iterations (notice the `i += 4`)
            const value = view.getUint32(i)
            // toString(16) will transform the integer into the corresponding hex string
            // but will remove any initial "0"
            const stringValue = value.toString(16)
            // One Uint32 element is 4 bytes or 8 hex chars (it would also work with 4
            // chars for Uint16 and 2 chars for Uint8)
            const padding = '00000000'
            const paddedValue = (padding + stringValue).slice(-padding.length)
            digest += paddedValue
        }

        return digest
    }
}
