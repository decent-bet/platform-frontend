class KeyHandler {
    constructor(keyStore) {
        this.keyStore = keyStore
    }

    /**
     * Initializes crypto keystore
     */
    async initialize() {
        await this.keyStore.initKeyStore()
    }

    /**
     * Caches a wallet's private key
     */
    set = async ({
        privateKey,
        address,
        mnemonic
    }) => {
        const cryptoKey = await this.keyStore.getCryptoKey()
        await this.keyStore.addVariable(
            'key',
            await this.keyStore.encrypt(privateKey, cryptoKey)
        )
        localStorage.setItem('address', address)

        if (mnemonic) {
            await this.keyStore.addVariable(
                'mnemonic',
                await this.keyStore.encrypt(mnemonic, cryptoKey)
            )
        }

        return Promise.resolve()
    }

    /**
     * Returns private key and mnemonic of the logged in user
     */
    get = async () => {
        let privateKey
        let mnemonic
        let address
        try {
            const cryptoKey = await this.keyStore.getCryptoKey()
            address = localStorage.getItem('address')

            const key = await this.keyStore.getVariable('key')
            let privateKeyArrayBuffer = await this.keyStore.decrypt(key, cryptoKey)
            privateKeyArrayBuffer = this.keyStore.ab2str(privateKeyArrayBuffer)

            const mnemonicBlob = await this.keyStore.getVariable('mnemonic')
            if(mnemonicBlob) {
                mnemonic = await this.keyStore.decrypt(mnemonicBlob, cryptoKey)
                mnemonic = this.keyStore.ab2str(mnemonic)
            }

            privateKey = privateKeyArrayBuffer
        } catch (e) {
            console.log(
                `KeyHandler.js: Error getting private key: ${e.message}`
            )
        }

        return { mnemonic, privateKey, address }
    }

    /**
     * Returns address of the logged in user
     */
    getAddress = () => {
        return localStorage.getItem('address')
    }

    /**
     * Clears the logged in keys
     */
    clear = () => {
        localStorage.clear()
        this.keyStore.clear()
    }

    isLoggedIn = () => {
        return localStorage.getItem('address') != null
    }
}

export default KeyHandler
