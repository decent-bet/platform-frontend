export interface ISlotsState {
    stateMachine: string
    minVTHOdialogIsOpen: boolean
    buildStatus: string
    claimableChannels: any[]
    activeChannels: any[]
    claimingChannel?: string | null
    currentChannel: string
}

export class SlotsState implements ISlotsState {
    public stateMachine = 'loading'
    public minVTHOdialogIsOpen = false
    public buildStatus = ''
    public claimableChannels = []
    public activeChannels = []
    public currentChannel = '0x'
    public claimingChannel = null
}
