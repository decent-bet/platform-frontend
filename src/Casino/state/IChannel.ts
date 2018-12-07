import BigNumber from 'bignumber.js'

interface IBalance {
    readonly userBalance: number
    readonly houseBalance: number
}

interface IChannelInfo {
    readonly initialDeposit: BigNumber
    readonly finalized: boolean
    readonly ready: boolean
    readonly activated: boolean
}

export interface IChannel {
    readonly status?: string
    readonly channelId?: string
    readonly aesKey: string
    readonly info: IChannelInfo
    readonly houseAuthorizedAddress: string
    readonly houseBalance: number
    readonly playerBalance: number
    readonly hashes: string[]
    readonly nonce: number
    readonly houseSpins: IBalance[]
    readonly lastSpinLoaded: boolean
    readonly finalized: boolean
    readonly closed: boolean
    readonly deposited: BigNumber
    readonly finalBalances?: BigNumber
    readonly claimed: {
        user: boolean
        house: boolean
    }
}

export const ChannelDefaultState = {
    aesKey: '0x',
    info: {
        initialDeposit: new BigNumber(0),
        finalized: false,
        ready: false,
        activated: false
    },
    houseAuthorizedAddress: '0x',
    houseBalance: 0,
    playerBalance: 0,
    hashes: [],
    nonce: 0,
    houseSpins: [],
    lastSpinLoaded: false,
    finalized: false,
    closed: false,
    deposited: new BigNumber(0),
    claimed: {
        user: false,
        house: false
    }
} as IChannel
