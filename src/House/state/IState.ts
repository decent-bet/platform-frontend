import BigNumber from 'bignumber.js'

export interface IState {
    readonly houseBalance: BigNumber
}

export const DefaultState: IState = {
    houseBalance: new BigNumber(0)
}
