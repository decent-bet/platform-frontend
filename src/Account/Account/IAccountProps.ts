import { History } from 'history'

export default interface IAccountProps {
    account: any
    accountHasAddress: boolean
    accountIsVerified: boolean
    saveAccountAddress(account: any, publicAddress: string, privateKey: string)
    saveAccountInfo(data: any)
    getChannelsHistory(publicAddress: string, currnetIndex: number)
    loading: boolean
    history: History
}
