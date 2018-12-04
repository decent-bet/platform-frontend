import BigNumber from 'bignumber.js'

/**
 * Redux State for the House Component
 */
export interface IState {
    readonly houseBalance: BigNumber
}

/**
 * Default Values for `IState`
 */
export const DefaultState: IState = {
    houseBalance: new BigNumber(0)
}
