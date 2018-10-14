export default interface IKeyHandler {
    /**
     * Caches a wallet's private key
     */
    setupWallet(
        privateKey: string,
        address: string,
        mnemonic?: string
    ): Promise<void>

    /**
     * Returns private key and mnemonic of the logged in user
     */
    getWalletValues(): Promise<{
        mnemonic: string
        privateKey: string
        address: string
    }>

    setAccountActivated(activated: boolean): Promise<void>
    getAccountActivationStatus(): Promise<boolean>

    /**
     * Returns public address of the logged in user
     */
    getPublicAddress(cryptoKey?: any): Promise<string | null>

    getAuthToken(): Promise<string>

    setAuthToken(token: string): Promise<void>

    clearStorage(): Promise<void>
}
