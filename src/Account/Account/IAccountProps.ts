import * as H from 'history'

export default interface IAccountProps {
    account: any
    accountHasAddress: boolean
    accountIsVerified: boolean
    saveAccountAddress(account: any, publicAddress: string, privateKey: string)
    saveAccountInfo(data: any)
    getTransactionHistory(publicAddress: string)
    transactions: any[]
    loading: boolean
    history: H.History
}
