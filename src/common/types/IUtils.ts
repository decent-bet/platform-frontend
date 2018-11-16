import IKeyHandler from './IKeyHandler'
import BigNumber from 'bignumber.js'

export default interface IUtils {
    signString(text, keyHandler: IKeyHandler): Promise<any>

    getUserHashes(randomNumber: number): Promise<string[]>

    random(length): string

    /**
     * Verify a sign for the message sign and given address
     *
     * @param {string} msg
     * @param {string} sign
     * @param {string} address
     */
    verifySign(msg: string, sign: string, address: string): boolean
    /**
     * Executes a spin for the Slots
     * @param {BigNumber} betSize
     * @param {any} state
     * @param {boolean} finalize
     */
    getSpin(
        betSize: BigNumber,
        state: any,
        finalize: boolean,
        keyHandler: any
    ): Promise<any>

    /**
     * Returns a tightly packed spin string
     * @param spin
     */
    getTightlyPackedSpin(spin): any

    getChannelDepositParams(channelNonce): Promise<any>

    getTimestamp(): number

    getTimestampInMillis(): number

    getEtherInWei(): any

    convertToEther(num): string

    formatEther(ether): string

    roundDecimals(number, decimals): number

    capitalize(str): string

    isUndefined(object): boolean

    duplicate(obj): any

    commafy(num): any

    getTx(clauses, blockRef): Promise<any>
}
