import BigNumber from 'bignumber.js'
import { IDepositItem } from './IDepositItem'

/**
 * Redux State for the House Component
 */
export interface IState {
    readonly houseBalance: BigNumber
    readonly houseDepositList: IDepositItem[]
}

/**
 * Default Values for `IState`
 */
export const DefaultState: IState = {
    houseBalance: new BigNumber(0),
    houseDepositList: []
}
