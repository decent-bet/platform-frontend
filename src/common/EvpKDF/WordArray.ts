// tslint:disable:no-bitwise
import { Hex } from './Hex'

/**
 * An array of 32-bit words.
 *
 * @property {Array} words The array of 32-bit words.
 * @property {number} sigBytes The number of significant bytes in this word array.
 */
export class WordArray {
    public words: number[]
    public sigBytes: number
    /**
     * Initializes a newly created word array.
     *
     * @param {Array} words (Optional) An array of 32-bit words.
     * @param {number} sigBytes (Optional) The number of significant bytes in the words.
     *
     * @example
     *
     *     const wordArray = CryptoJS.lib.WordArray.create();
     *     const wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
     *     const wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
     */
    constructor(words?: number[], sigBytes?: number) {
        words = this.words = words || []
        if (sigBytes !== undefined) {
            this.sigBytes = sigBytes
        } else {
            this.sigBytes = words.length * 4
        }
    }

    /**
     * Converts this word array to a string.
     *
     * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
     *
     * @return {string} The stringified word array.
     *
     * @example
     *
     *     const string = wordArray + '';
     *     const string = wordArray.toString();
     *     const string = wordArray.toString(CryptoJS.enc.Utf8);
     */
    public toString(encoder?) {
        return (encoder || Hex).stringify(this)
    }

    /**
     * Concatenates a word array to this word array.
     *
     * @param {WordArray} wordArray The word array to append.
     *
     * @return {WordArray} This word array.
     *
     */
    public concat(wordArray: WordArray) {
        // Shortcuts
        const thisWords = this.words
        const thatWords = wordArray.words
        const thisSigBytes = this.sigBytes
        const thatSigBytes = wordArray.sigBytes

        // Clamp excess bits
        this.clamp()

        // Concat
        if (thisSigBytes % 4) {
            // Copy one byte at a time
            for (let i = 0; i < thatSigBytes; i++) {
                const thatByte =
                    (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
                thisWords[(thisSigBytes + i) >>> 2] |=
                    thatByte << (24 - ((thisSigBytes + i) % 4) * 8)
            }
        } else {
            // Copy one word at a time
            for (let i = 0; i < thatSigBytes; i += 4) {
                thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2]
            }
        }
        this.sigBytes += thatSigBytes

        // Chainable
        return this
    }

    /**
     * Removes insignificant bits.
     *
     * @example
     *
     *     wordArray.clamp();
     */
    public clamp() {
        // Shortcuts
        const words = this.words
        const sigBytes = this.sigBytes

        // Clamp
        words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8)
        words.length = Math.ceil(sigBytes / 4)
    }



    /**
     * Creates a word array filled with random bytes.
     *
     * @param {number} nBytes The number of random bytes to generate.
     *
     * @return {WordArray} The random word array.
     *
     * @static
     *
     * @example
     *
     *     const wordArray = CryptoJS.lib.WordArray.random(16);
     */
    public static random(nBytes) {
        const words = []

        const r = function(input) {
            let m_w = input
            let m_z = 0x3ade68b1
            const mask = 0xffffffff

            return () => {
                m_z = (0x9069 * (m_z & 0xffff) + (m_z >> 0x10)) & mask
                m_w = (0x4650 * (m_w & 0xffff) + (m_w >> 0x10)) & mask
                let result = ((m_z << 0x10) + m_w) & mask
                result /= 0x100000000
                result += 0.5
                return result * (Math.random() > 0.5 ? 1 : -1)
            }
        }

        for (let i = 0, rcache; i < nBytes; i += 4) {
            const _r = r((rcache || Math.random()) * 0x100000000)

            rcache = _r() * 0x3ade67b7
            // @ts-ignore
            words.push((_r() * 0x100000000) | 0)
        }

        return new WordArray(words, nBytes)
    }
}
