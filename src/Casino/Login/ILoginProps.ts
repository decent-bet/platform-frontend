import { WithStyles } from '@material-ui/core'
import styles from './styles'

export default interface ILoginProps extends WithStyles<typeof styles> {
    onLoginSuccess: () => void
    account: any
}
