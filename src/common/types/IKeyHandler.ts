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

    storeTempPrivateKey(value: string): Promise<void>
    getTempPrivateKey(): Promise<string | null>
    removeTempPrivateKey(): Promise<void>
    /**
     * Returns public address of the logged in user
     */
    getPublicAddress(cryptoKey?: any): Promise<string | null>

    getAuthToken(): Promise<string>

    getRefreshToken(): Promise<string>

    setAuthToken(token: string, refreshToken: string): Promise<void>

    clearStorage(): Promise<void>
}
