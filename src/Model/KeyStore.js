import Dexie from 'dexie'
// Based partially from https://gist.github.com/saulshanabrook/b74984677bccd08b028b30d9968623f5

export class KeyStore {
    constructor() {
        this.db = new Dexie('DbetKeystore')

        this.db.version(1).stores({
            keys: '++id, key, value'
        })

        this.db.version(1).stores({
            vars: '++id, name, value'
        })
    }

    /**
     * Initializes crypto keystore
     */
    async initKeyStore() {
        let keys = await this.db.keys.toArray()

        if (keys.length === 0) {
            keys = await this.createCryptoKey()
            await this.db.keys.add({
                key: 'keystoreKey',
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
        const keys = await this.db.keys
            .where('key')
            .equalsIgnoreCase('keystoreKey')
            .toArray()

        if (keys.length > 0) {
            return keys[0].value
        } else {
            throw new Error('Invalid passphrase or key')
        }
    }

    async getVariable(name) {
        const items = await this.db.vars
            .where('name')
            .equalsIgnoreCase(name)
            .toArray()

        if (items.length > 0) {
            return items[0].value
        } else {
            return null
        }
    }

    async addVariable(name, value) {
        return await this.db.vars.add({
            name,
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
        return new Uint8Array(
            await window.crypto.subtle.decrypt(
                {
                    name: 'RSA-OAEP'
                    //label: Uint8Array([...]) //optional
                },
                keys.privateKey,
                data
            )
        )
    }

    async clear() {
        await this.db.keys.clear()
        await this.db.vars.clear()
    }

    ab2str(uint8array) {
        return new TextDecoder().decode(uint8array)
    }

    str2ab(str) {
        return new TextEncoder('utf-8').encode(str)
    }
}
