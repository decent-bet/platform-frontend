import { WithStyles } from '@material-ui/core'
import styles from './styles'

export default interface ILoginProps extends WithStyles<typeof styles> {
    loginDialogOpen: boolean
    onLoginSuccess: () => void
    account: any
    fullScreen?: boolean
}
