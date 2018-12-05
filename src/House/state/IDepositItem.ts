import BigNumber from 'bignumber.js'
import { Moment } from 'moment'

export interface IDepositItem {
    toAddress: string
    fromAddress: string
    txHash: string
    amount: BigNumber
    balance: BigNumber
    date: Moment
}
