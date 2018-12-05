import BigNumber from 'bignumber.js'

export interface IPayloadGetHouseBalance {
    readonly balance: BigNumber
}

export interface IPayloadGetContractAddress {
    readonly contractAddress: string
}

/**
 * Possible Payloads for the Action on the House Component
 */
export type Payload = IPayloadGetHouseBalance | IPayloadGetContractAddress
