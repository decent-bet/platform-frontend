import { IKeyStore, IKeyHandler } from '../types'
import { AUTH_TOKEN_NAME, ACCOUNT_ACTIVATED_NAME } from '../../constants'

class KeyHandler implements IKeyHandler {
    /**
     * @param {IKeyStore} keyStore
     */
    constructor(private keyStore: IKeyStore) {}
    /**
     * Caches a wallet's private key
     */
    public async setupWallet(
        privateKey: string,
        address: string,
        mnemonic?: string
    ): Promise<void> {
        const cryptoKey = await this.keyStore.getCryptoKey()

        await this.keyStore.addVariable(
            'key',
            await this.keyStore.encrypt(privateKey, cryptoKey)
        )
        await this.keyStore.addVariable('address', btoa(address))

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
    public async getWalletValues(): Promise<{
        mnemonic: string
        privateKey: string
        address: string
    }> {
        let privateKey
        let mnemonic
        let address

        const cryptoKey = await this.keyStore.getCryptoKey()
        address = this.getPublicAddress()

        const keyBlob = await this.keyStore.getVariable('key')
        if (keyBlob) {
            privateKey = await this.keyStore.decrypt(keyBlob, cryptoKey)
        }

        const mnemonicBlob = await this.keyStore.getVariable('mnemonic')
        if (mnemonicBlob) {
            mnemonic = await this.keyStore.decrypt(mnemonicBlob, cryptoKey)
        }

        return { mnemonic, privateKey, address }
    }

    /**
     * Returns public address of the logged in user
     */
    public async getPublicAddress(): Promise<string | null> {
        let address = await this.keyStore.getVariable('address')
        if (address) {
            return atob(address)
        }

        return null
    }

    public async setAccountActivated(activated: boolean): Promise<void> {
        await this.keyStore.addVariable(ACCOUNT_ACTIVATED_NAME, activated)
    }

    public async getAccountActivationStatus(): Promise<boolean> {
        return await this.keyStore.getVariable(ACCOUNT_ACTIVATED_NAME)
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
        await this.keyStore.clear()
    }
}

export default KeyHandler
