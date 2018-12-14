import { History } from 'history'

export default interface IAccountProps {
    account: any
    accountHasAddress: boolean
    accountIsVerified: boolean
    saveAccountAddress(account: any, publicAddress: string, privateKey: string)
    saveAccountInfo(data: any)
    loading: boolean
    history: History
}
