export default interface IKeyStore {
    createCryptoKey(): PromiseLike<CryptoKeyPair>

    getCryptoKey(): Promise<any>

    getVariable(name: string): Promise<any>

    addVariable(name: string, value: any): Promise<void>

    encrypt(data: string, keys: CryptoKeyPair): PromiseLike<ArrayBuffer>

    decrypt(data: ArrayBuffer, keys: CryptoKeyPair): PromiseLike<any>

    clear(): Promise<void>

    clearVariable(name: string): Promise<void>

    ab2str(uint8array): string

    str2ab(str): Uint8Array
}
