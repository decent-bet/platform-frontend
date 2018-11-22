import { WordArray } from './WordArray'
import { Hasher } from './Hasher'
import { BufferedBlockAlgorithm } from './BufferedBlockAlgorithm'

export interface IEvpKDFConfig {
    keySize: number
    iterations?: number
}
export function createEvpKDF(
    password: string,
    salt: string,
    config: IEvpKDFConfig = { keySize: 128 / 32, iterations: 1 }
) {
    let block
    const buffer = new BufferedBlockAlgorithm()
    const hasher: Hasher = new Hasher(buffer)

    // Initial values
    let derivedKey: WordArray = new WordArray()

    // Shortcuts
    let derivedKeyWords = derivedKey.words
    let keySize = config.keySize
    let iterations = config.iterations

    // Generate key
    while (derivedKeyWords.length < keySize) {
        if (block) {
            hasher.update(block)
        }
        block = hasher.update(password).finalize(salt)
        hasher.reset()

        // Iterations
        // @ts-ignore
        for (let i = 1; i < iterations; i++) {
            block = hasher.finalize(block)
            hasher.reset()
        }

        derivedKey.concat(block)
    }
    derivedKey.sigBytes = keySize * 4

    return derivedKey
}

export function deriveKeyIVFromPassword(
    password: string,
    keySize: number,
    ivSize: number,
    salt: any
) {
    // Generate random salt
    if (!salt) {
        salt = WordArray.random(64 / 8)
    }

    // Derive key and IV
    let key = createEvpKDF(password, salt, { keySize: keySize + ivSize })
    // Separate key and IV
    let iv = new WordArray(key.words.slice(keySize), ivSize * 4)
    key.sigBytes = keySize * 4

    // Return params
    return { key, iv, salt }
}
