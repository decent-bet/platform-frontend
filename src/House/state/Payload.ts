import BigNumber from 'bignumber.js'
import { IDepositItem } from './IDepositItem'

export interface IPayloadGetHouseBalance {
    readonly balance: BigNumber
}

export interface IPayloadGetHouseDeposits {
    readonly depositItemList: IDepositItem[]
}

/**
 * Possible Payloads for the Action on the House Component
 */
export type Payload = IPayloadGetHouseBalance | IPayloadGetHouseDeposits
