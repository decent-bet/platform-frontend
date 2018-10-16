import { IKeyHandler, IUtils } from '../types'
import ethUtil from 'ethereumjs-util'
import { SHA256 } from 'crypto-js'
import ethUnits from 'ethereum-units'
import BigNumber from 'bignumber.js'

const initialChannelHouseBalance = new BigNumber(10).pow(18).times(10000)
/**
 * Utils class for common use
 */

export default class Utils implements IUtils {
    constructor() {}

    /** Solidity ecsign implementation */
    public async signString(text, keyHandler: IKeyHandler): Promise<any> {
        /*
         * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the user's address;
         */
        return new Promise(async (resolve, reject) => {
            let msgHash = ethUtil.sha3(text)
            let { privateKey } = await keyHandler.getWalletValues()
            privateKey = ethUtil.toBuffer(privateKey)
            let defaultAccount = keyHandler.getPublicAddress()
            console.log(
                'Signing',
                text,
                ethUtil.bufferToHex(msgHash),
                'as',
                defaultAccount,
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

            console.log('Generated sign address', adr, defaultAccount)

            console.log('Generated msgHash', msgHash, 'Sign', sgn)
            let address = await keyHandler.getPublicAddress()
            if (address && adr !== address.toLowerCase())
                reject(new Error('Invalid address for signed message'))

            resolve({ msgHash, sig: sgn })
        })
    }

    public getUserHashes(randomNumber: number): string[] {
        let lastHash
        let hashes: string[] = []
        for (let i = 0; i < 1000; i++) {
            let hash = SHA256(i === 0 ? randomNumber : lastHash).toString()
            hashes.push(hash)
            lastHash = hash
        }
        return hashes
    }

    public random(length): number {
        let randomValuesArray = new Uint32Array(length)
        window.crypto.getRandomValues(randomValuesArray)

        let outputString = ''
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < randomValuesArray.length; i++) {
            outputString += randomValuesArray[i]
        }

        return Number(outputString.slice(0, length))
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
        finalize: boolean,
        keyHandler: any
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
        let sign: any = await this.signString(packedString, keyHandler)
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
        return Math.round(new Date().getTime())
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
}
