import BigNumber from 'bignumber.js'

export interface IPayloadGetHouseBalance {
    readonly balance: BigNumber
}
export type Payload = IPayloadGetHouseBalance
