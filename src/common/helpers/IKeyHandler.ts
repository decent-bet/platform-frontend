import { StageType } from "../../config";

export default interface IKeyHandler {
    /**
     * Caches a wallet's private key
     */
    setupWallet(privateKey: string, address: string, mnemonic: string): Promise<void>

    /**
     * Returns private key and mnemonic of the logged in user
     */
    getWalletValues(): Promise<{ mnemonic: string, privateKey: string, address: string }>

    /**
     * Returns public address of the logged in user
     */
    getPublicAddress(): string | null

    getStage(): StageType

    setStage(stage): void

    getAuthToken(): Promise<string>
    
    setAuthToken(token: string): Promise<void>

    clearStorage(): Promise<void>
}
