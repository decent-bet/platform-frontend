export enum SlotsStateMachine {
    Claiming,
    ClaimingFromContract,
    Loading,
    ListGames,
    SelectGame,
    BuildingGame,
    SelectChannels
}

export interface ISlotsState {
    stateMachine: SlotsStateMachine
    minVTHOdialogIsOpen: boolean
    buildStatus: string
    claimableChannels: string[]
    activeChannels: string[]
    claimingChannel?: string
    currentChannel: string
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
