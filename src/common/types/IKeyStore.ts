export default interface IKeyStore {
    createCryptoKey(): PromiseLike<CryptoKeyPair>

    getCryptoKey(): Promise<any>

    getVariable(name): Promise<any>

    addVariable(name, value): Promise<void>

    encrypt(data, keys): PromiseLike<any>

    decrypt(data, keys): PromiseLike<any>

    clear(): Promise<void>

    clearVariable(name): Promise<void>

    ab2str(uint8array): string

    str2ab(str): Uint8Array
}
