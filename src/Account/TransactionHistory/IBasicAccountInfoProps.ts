import { WithStyles } from '@material-ui/core'
import styles from './styles'
export default interface IBasicAccountInfoProps
    extends WithStyles<typeof styles> {
    account: any
}
