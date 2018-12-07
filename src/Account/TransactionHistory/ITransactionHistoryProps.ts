import { WithStyles } from '@material-ui/core'
import styles from './styles'
export default interface ITransactionHistoryProps
    extends WithStyles<typeof styles> {
    loading: boolean
    transactions: any[]
    loadTransactions: () => Promise<any[]>
}
