
import { DEFAULT_STAGE } from '../config'

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

            const keyBlob = await this.keyStore.getVariable('key')
            if(keyBlob){
                privateKey = await this.keyStore.decrypt(keyBlob, cryptoKey)
            }

            const mnemonicBlob = await this.keyStore.getVariable('mnemonic')
            if(mnemonicBlob) {
                mnemonic = await this.keyStore.decrypt(mnemonicBlob, cryptoKey)
            }
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

    getStage = () => {
        let stage = localStorage.getItem('stage')
        
        if(!stage || stage ==='undefined') {
            stage = DEFAULT_STAGE
        }

        return stage
    }

    setStage = (stage) => {
        localStorage.setItem('stage', stage)
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
