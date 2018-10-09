
import { DEFAULT_STAGE, StageType } from '../../config'
import IKeyStore from './IKeyStore'
import IKeyHandler from './IKeyHandler'
import { AUTH_TOKEN_NAME, ACCOUTN_ACTIVATED_NAME } from '../../config'

class KeyHandler implements IKeyHandler {

    /**
     * @param {IKeyStore} keyStore
     */
    constructor(private keyStore: IKeyStore) {}
    /**
     * Caches a wallet's private key
     */
    public async setupWallet(privateKey: string, address: string, mnemonic: string): Promise<void> {
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
    }

    /**
     * Returns private key and mnemonic of the logged in user
     */
    public async getWalletValues(): Promise<{ mnemonic: string, privateKey: string, address: string }> {
        let privateKey
        let mnemonic
        let address
        
        const cryptoKey = await this.keyStore.getCryptoKey()
        address = this.getPublicAddress()

        const keyBlob = await this.keyStore.getVariable('key')
        if(keyBlob){
            privateKey = await this.keyStore.decrypt(keyBlob, cryptoKey)
        }

        const mnemonicBlob = await this.keyStore.getVariable('mnemonic')
        if(mnemonicBlob) {
            mnemonic = await this.keyStore.decrypt(mnemonicBlob, cryptoKey)
        }

        return { mnemonic, privateKey, address }
    }

    /**
     * Returns public address of the logged in user
     */
    public getPublicAddress(): string | null {
        let address = localStorage.getItem('address')

        if(!address || address ==='undefined') {
            return null
        }

        return address
    }

    public async setAccountActivated(activated: boolean): Promise<void> {
        await this.keyStore.addVariable(ACCOUTN_ACTIVATED_NAME, activated)
    }

    public async getAccountActivationStatus(): Promise<boolean> {
        return await this.keyStore.getVariable(ACCOUTN_ACTIVATED_NAME)
    }

    public getStage(): StageType {
        let stage = localStorage.getItem('stage')
        
        if(!stage || stage ==='undefined') {
            stage = DEFAULT_STAGE
        }

        return stage as StageType
    }

    public setStage(stage): void {
        localStorage.setItem('stage', stage)
    }

    /**
     * Store the jwt token
     * @param {string} token
     * @returns {Promise<void>}
     */
    public async setAuthToken(token: string): Promise<void> {
        await this.keyStore.addVariable(AUTH_TOKEN_NAME, token)
    }

    /**
     * Return the stored jwt token if exists
     * @returns {Promise<string>}
     */
    public async getAuthToken(): Promise<string> {
        return await this.keyStore.getVariable(AUTH_TOKEN_NAME)
    }

    public async clearStorage(): Promise<void> {
        localStorage.clear()
        await this.keyStore.clear()
    }
}

export default KeyHandler