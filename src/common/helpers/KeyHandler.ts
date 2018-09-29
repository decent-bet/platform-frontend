
import { DEFAULT_STAGE } from '../../config'

class KeyHandler {

    /**
     * @param {KeyStore} keyStore
     */
    constructor(private keyStore) {}
    /**
     * Caches a wallet's private key
     */
    public set = async ({
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
    public get = async () => {
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
    public getAddress = () => {
        return localStorage.getItem('address') 
    }

    public getStage = () => {
        let stage = localStorage.getItem('stage')
        
        if(!stage || stage ==='undefined') {
            stage = DEFAULT_STAGE
        }

        return stage
    }

    public setStage = (stage) => {
        localStorage.setItem('stage', stage)
    }
}

export default KeyHandler
