import BigNumber from 'bignumber.js'

/**
 * Redux State for the House Component
 */
export interface IState {
    readonly houseAddress: string
    readonly houseBalance: BigNumber
}

/**
 * Default Values for `IState`
 */
export const DefaultState: IState = {
    houseAddress: '0x',
    houseBalance: new BigNumber(0)
}
