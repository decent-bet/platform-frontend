import { IChannel } from './IChannel'
import BigNumber from 'bignumber.js'

export interface IChannelMap {
    readonly [id: string]: IChannel
}

export interface ICasinoState {
    readonly houseBalance: BigNumber
    readonly houseMonthlyBalance: BigNumber
    readonly isCasinoLogedIn: boolean
    readonly slotsInitialized: boolean
    readonly channels: IChannelMap
    readonly allowance: number
    readonly balance: number // channel balance
    readonly tokenBalance: number
    readonly vthoBalance: number
}

export const CasinoState: ICasinoState = {
    houseBalance: new BigNumber(0),
    houseMonthlyBalance: new BigNumber(0),
    isCasinoLogedIn: false,
    slotsInitialized: false,
    channels: {},
    allowance: 0,
    balance: 0,
    tokenBalance: 0,
    vthoBalance: 0
}
