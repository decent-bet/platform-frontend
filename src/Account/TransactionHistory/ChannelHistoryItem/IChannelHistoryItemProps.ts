import { WithStyles } from '@material-ui/core'
import styles from './styles'
import IChannelHistoryItem from '../IChannelHistoryItem'
export default interface ITransactionHistoryProps
    extends WithStyles<typeof styles> {
    channel: IChannelHistoryItem
}
