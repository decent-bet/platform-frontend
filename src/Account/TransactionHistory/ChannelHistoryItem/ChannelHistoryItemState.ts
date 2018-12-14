export interface IChannelHistoryItemState {
    expanded: boolean
    loadingDetails: boolean
}

export const DefaultState: IChannelHistoryItemState = {
    expanded: false,
    loadingDetails: false
}
