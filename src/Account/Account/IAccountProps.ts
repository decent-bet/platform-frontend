import { History } from 'history'
import IChannelHistoryItem from '../TransactionHistory/ChannelHistoryItem/IChannelHistoryItem'

export default interface IAccountProps {
    account: any
    accountHasAddress: boolean
    accountIsVerified: boolean
    saveAccountAddress(account: any, publicAddress: string, privateKey: string)
    saveAccountInfo(data: any)
    getTransactionHistory(publicAddress: string)
    channels: IChannelHistoryItem[]
    loading: boolean
    history: History
}
