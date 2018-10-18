export interface ISlotsState {
    stateMachine: string
    buildStatus: string
    claimableChannels: any[]
    activeChannels: any[]
    currentChannel: string
}

export class SlotsState implements ISlotsState {
    public stateMachine = 'loading'
    public buildStatus = ''
    public claimableChannels = []
    public activeChannels = []
    public currentChannel = '0x'
}
