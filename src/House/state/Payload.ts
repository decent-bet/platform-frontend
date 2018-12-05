import BigNumber from 'bignumber.js'
import { IDepositItem } from './IDepositItem'

export interface IPayloadGetHouseBalance {
    readonly balance: BigNumber
}

export interface IPayloadGetHouseDeposits {
    readonly depositItemList: IDepositItem[]
}

export interface IPayloadGetContractAddress {
    readonly contractAddress: string
}

/**
 * Possible Payloads for the Action on the House Component
 */
export type Payload =
    | IPayloadGetHouseBalance
    | IPayloadGetHouseDeposits
    | IPayloadGetContractAddress
