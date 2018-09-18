
import Dexie from 'dexie'
// Based partially from https://gist.github.com/saulshanabrook/b74984677bccd08b028b30d9968623f5

export class KeyStore {

    constructor() {

        this.db = new Dexie('DbetKeystore')

        this.db.version(1).stores({
            keys: 'id, value'
        })
    }

    /**
     * Initializes crypto keystore
     */
    async initKeyStore() {
        let keys = await this.db.keys.get('keystoreKey')

        if (!keys) {
            keys = await this.createCryptoKey()
            await this.db.keys.put({
                id: 'keystoreKey',
                value: keys
            })
        }
    }

    /**
     * Creates non exportable crypto key
     */
    createCryptoKey() {
        return window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: 'SHA-256' }
            },
            false,
            ['encrypt', 'decrypt']
        )
    }

    async getCryptoKey() {
        const keys = await this.db.keys.get('keystoreKey')

        if (keys) {
            return keys.value //
        } else {
            throw new Error('Invalid passphrase or key')
        }
    }

    async getVariable(name) {
        const record = await this.db.keys.get(name)
        return record && record.value ? record.value : null
    }

    async addVariable(name, value) {
        return await this.db.keys.put({
            id: name,
            value
        })
    }

    encrypt(data, keys) {
        return window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
                //label: Uint8Array([...]) //optional
            },
            keys.publicKey,
            this.str2ab(data)
        )
    }

    async decrypt(data, keys) {

        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP'
                //label: Uint8Array([...]) //optional
            },
            keys.privateKey,
            data
        )
        return this.ab2str(new Uint8Array(decrypted))
    }

    async clear() {
        await this.db.keys.clear()
    }

    ab2str(uint8array) {
        return new TextDecoder().decode(uint8array)
    }

    str2ab(str) {
        return new TextEncoder('utf-8').encode(str)
    }
}