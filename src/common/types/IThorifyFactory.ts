export default interface IThorifyFactory {
    make(): any
    configured(publicAddress?: string, privateKey?: string): Promise<any>
}
