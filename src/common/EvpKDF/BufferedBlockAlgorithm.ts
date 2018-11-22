// tslint:disable:no-bitwise
import { WordArray } from './WordArray'
import { MD5 } from './MD5Hasher'

/**
 * Abstract buffered block algorithm template.
 *
 * The property blockSize must be implemented in a concrete subtype.
 *
 * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
 */
export class BufferedBlockAlgorithm {
    public _data: WordArray
    public _nDataBytes: number
    public _minBufferSize: number = 0

    constructor(public blockSize: number = 512 / 32) {}
    /**
     * Resets this block algorithm's data buffer to its initial state.
     *
     * @example
     *
     *     bufferedBlockAlgorithm.reset();
     */
    public reset() {
        // Initial values
        this._data = new WordArray()
        this._nDataBytes = 0
    }
    private _parse(latin1Str) {
        // Shortcut
        let latin1StrLength = latin1Str.length
        // Convert
        let words = []
        for (let i = 0; i < latin1StrLength; i++) {
            // @ts-ignore
            words[i >>> 2] |=
                (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8)
        }

        return new WordArray(words, latin1StrLength)
    }

    /**
     * Adds new data to this block algorithm's buffer.
     *
     * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
     *
     * @example
     *
     *     bufferedBlockAlgorithm._append('data');
     *     bufferedBlockAlgorithm._append(wordArray);
     */
    public append(data: WordArray | string) {
        // Convert string to WordArray, else assume WordArray already
        if (typeof data === 'string') {
            data = this._parse(unescape(encodeURIComponent(data)))
        }
        // Append
        this._data.concat(data)
        this._nDataBytes += data.sigBytes
    }

    /**
     * Processes available data blocks.
     *
     * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
     *
     * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
     *
     * @return {WordArray} The processed data.
     *
     * @example
     *
     *     let processedData = bufferedBlockAlgorithm._process();
     *     let processedData = bufferedBlockAlgorithm._process(!!'flush');
     */
    public process(doFlush: boolean, hasher: MD5) {
        let processedWords

        // Shortcuts
        let data = this._data
        let dataWords = data.words
        let dataSigBytes = data.sigBytes
        let blockSize = this.blockSize
        let blockSizeBytes = blockSize * 4
        // Count blocks ready
        let nBlocksReady = dataSigBytes / blockSizeBytes

        if (doFlush) {
            // Round up to include partial blocks
            nBlocksReady = Math.ceil(nBlocksReady)
        } else {
            // Round down to include only full blocks,
            // less the number of blocks that must remain in the buffer
            // tslint:disable-next-line:no-bitwise
            nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0)
        }

        // Count words ready
        let nWordsReady = nBlocksReady * blockSize

        // Count bytes ready
        let nBytesReady = Math.min(nWordsReady * 4, dataSigBytes)
        // Process blocks
        if (nWordsReady) {
            for (let offset = 0; offset < nWordsReady; offset += blockSize) {
                // Perform concrete-algorithm logic
                hasher.doProcessBlock(dataWords, offset)
            }

            // Remove processed words
            processedWords = dataWords.splice(0, nWordsReady)
            data.sigBytes -= nBytesReady
        }

        // Return processed words
        return new WordArray(processedWords, nBytesReady)
    }
}
