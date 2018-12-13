import { WithStyles } from '@material-ui/core'
import styles from './styles'
import IChannelHistoryItem from './IChannelHistoryItem'
export default interface ITransactionHistoryProps
    extends WithStyles<typeof styles> {
    vetAddress: string
    channels: IChannelHistoryItem[]
    getChannelsHistory(vetAddress: string, currentIndex: number)
}
