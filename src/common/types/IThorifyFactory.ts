export default interface IThorifyFactory {
    make(publicAddress?: string, privateKey?: string): Promise<any>
}
