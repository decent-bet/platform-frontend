export default interface IAccountAddressProps {
    accountHasAddress: boolean
    account: any
    isSaving: boolean
    saveAccountAddress(publicAddress: string, privateKey: string): Promise<void>
}
