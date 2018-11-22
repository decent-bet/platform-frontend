// tslint:disable:no-bitwise
import { WordArray } from './WordArray'

/**
 * Hex encoding strategy.
 */
export class Hex {
    public static stringify(wordArray) {
        // Shortcuts
        let words = wordArray.words
        let sigBytes = wordArray.sigBytes

        // Convert
        let hexChars = []
        for (let i = 0; i < sigBytes; i++) {
            let bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
            // @ts-ignore
            hexChars.push((bite >>> 4).toString(16))
            // @ts-ignore
            hexChars.push((bite & 0x0f).toString(16))
        }

        return hexChars.join('')
    }

    /**
     * Converts a hex string to a word array.
     *
     * @param {string} hexStr The hex string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     let wordArray = CryptoJS.enc.Hex.parse(hexString);
     */
    public static parse(hexStr) {
        // Shortcut
        let hexStrLength = hexStr.length

        // Convert
        let words = []
        for (let i = 0; i < hexStrLength; i += 2) {
            // @ts-ignore
            words[i >>> 3] |=
                parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4)
        }

        return new WordArray(words, hexStrLength / 2)
    }
}
