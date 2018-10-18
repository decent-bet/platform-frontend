import { IKeyStore } from '../types'
import Dexie from 'dexie'
// Based partially from https://gist.github.com/saulshanabrook/b74984677bccd08b028b30d9968623f5

export default class KeyStore implements IKeyStore {
    private db: Dexie

    constructor() {
        this.db = new Dexie('DbetKeystore')
        this.db.version(1).stores({
            keys: 'id, value'
        })
    }

    /**
     * Creates non exportable crypto key
     */
    public async createCryptoKey(): Promise<CryptoKeyPair> {
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

    public async getCryptoKey(): Promise<any> {
        let keys = await this.db.table('keys').get('keystoreKey')

        if (keys) {
            return keys.value
        } else {
            keys = await this.createCryptoKey()
            await this.db.table('keys').put({
                id: 'keystoreKey',
                value: keys
            })
            return keys
        }
    }

    public async getVariable(name): Promise<any> {
        const record = await this.db.table('keys').get(name)
        return record && record.value ? record.value : null
    }

    public async addVariable(name, value): Promise<void> {
        return await this.db.table('keys').put({
            id: name,
            value
        })
    }

    public encrypt(data, keys): PromiseLike<any> {
        return window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            keys.publicKey,
            this.str2ab(data)
        )
    }

    public async decrypt(data, keys): Promise<any> {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP'
            },
            keys.privateKey,
            data
        )

        return this.ab2str(new Uint8Array(decrypted))
    }

    public async clear(): Promise<void> {
        await this.db.delete()
    }

    public ab2str(uint8array): string {
        return new TextDecoder().decode(uint8array)
    }

    public str2ab(str): Uint8Array {
        return new TextEncoder().encode(str)
    }
}
