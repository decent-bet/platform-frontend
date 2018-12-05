import BigNumber from 'bignumber.js'
import { IDepositItem } from './IDepositItem'

/**
 * Redux State for the House Component
 */
export interface IState {
    readonly houseAddress: string
    readonly houseBalance: BigNumber
    readonly houseDepositList: IDepositItem[]
}

/**
 * Default Values for `IState`
 */
export const DefaultState: IState = {
    houseAddress: '0x',
    houseBalance: new BigNumber(0),
    houseDepositList: []
}
