import { WithStyles } from '@material-ui/core'
import styles from './styles'
import IChannelHistoryItem from '../IChannelHistoryItem'
export default interface ITransactionHistoryProps
    extends WithStyles<typeof styles> {
    channel: IChannelHistoryItem
    vetAddress: string
    details: any
    getChannelDetails(channelId: string, initialDeposit: any, address: string)
}
