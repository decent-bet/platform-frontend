export enum SlotsStateMachine {
    Claiming,
    ClaimingFromContract,
    Loading,
    ListGames,
    SelectGame,
    BuildingGame,
    SelectChannels
}

// We still have no typings for the Channels.
export type Channel = any

export interface ISlotsState {
    stateMachine: SlotsStateMachine
    minVTHOdialogIsOpen: boolean
    buildStatus: string
    claimableChannels: Channel[]
    activeChannels: Channel[]
    claimingChannel?: string
    currentChannel: Channel
}

export const SlotsState: ISlotsState = {
    stateMachine: SlotsStateMachine.Loading,
    minVTHOdialogIsOpen: false,
    buildStatus: '',
    claimableChannels: [],
    activeChannels: [],
    currentChannel: '0x',
    claimingChannel: undefined
}
