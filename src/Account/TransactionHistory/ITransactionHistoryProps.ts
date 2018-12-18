import { WithStyles } from '@material-ui/core'
import styles from './styles'
import IChannelHistoryItem from './IChannelHistoryItem'
export default interface ITransactionHistoryProps
    extends WithStyles<typeof styles> {
    vetAddress: string
    channels: IChannelHistoryItem[]
    details: any
    currentIndex: number
    itemsNotFound: boolean
    isLoading: boolean
    isLoadingMore: boolean
    getChannelsHistory(vetAddress: string, currentIndex: number)
    getChannelDetails(channelId: string, initialDeposit: any, address: string)
}
