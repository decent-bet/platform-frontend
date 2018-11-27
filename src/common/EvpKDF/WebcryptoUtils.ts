import { WordArray, deriveKeyIVFromPassword } from '@decent-bet/crypto-evpkdf'
export class WebcryptoUtils {
    public static getIV(password) {
        const keySize = 256 / 32
        const ivSize = 512 / 32
        const salt = new WordArray([
            0x1212121212,
            0x12121212,
            0x121212121,
            0x121212,
            0x121212
        ])
        const wordArray = deriveKeyIVFromPassword(
            password,
            keySize,
            ivSize,
            salt
        )

        return wordArray.iv
    }

    /**
     * Import passphrase key using AES-CBC 256
     * @param passphraseKey
     */
    public static async importKey_AESCBC(passphraseKey: string) {
        const ivInternal = WebcryptoUtils.getIV(passphraseKey)
        const passphrase = new TextEncoder().encode(passphraseKey)
        const pwHash = await crypto.subtle.digest(
            { name: 'SHA-256' },
            passphrase
        )

        const iv = new Uint8Array(ivInternal.words)
        const alg = { name: 'AES-CBC', iv, length: 256 }
        const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
            'decrypt',
            'encrypt'
        ])

        return { key, iv }
    }

    /**
     * Encrypts with AES
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    public static async encryptAES(
        { key, iv }: { key: CryptoKey; iv: Uint8Array },
        buffer: string
    ): Promise<ArrayBuffer> {
        const data: Uint8Array = new TextEncoder().encode(buffer)
        let encrypted = await crypto.subtle.encrypt(
            { ...key.algorithm, iv },
            key,
            data
        )
        return encrypted
    }

    /**
     * Decrypts with AES
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    public static async decryptAES(
        { key, iv }: { key: CryptoKey; iv: Uint8Array },
        data: string
    ): Promise<ArrayBuffer> {
        const buffer: Uint8Array = new TextEncoder().encode(data)
        let result = await crypto.subtle.decrypt(
            { ...key.algorithm, iv },
            key,
            buffer
        )

        return result
    }
}
