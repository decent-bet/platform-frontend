import IChannelHistoryItem from './IChannelHistoryItem'

export default interface IChannelsHistory {
    currentIndex: number
    items: IChannelHistoryItem[]
}
