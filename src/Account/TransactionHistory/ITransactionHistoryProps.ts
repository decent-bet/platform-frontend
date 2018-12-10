import { WithStyles } from '@material-ui/core'
import styles from './styles'
import IChannelHistoryItem from './ChannelHistoryItem/IChannelHistoryItem'
export default interface ITransactionHistoryProps
    extends WithStyles<typeof styles> {
    loading: boolean
    channels: IChannelHistoryItem[]
    loadTransactions: () => Promise<any[]>
}
