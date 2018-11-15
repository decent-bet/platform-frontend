import { WithStyles } from '@material-ui/core'
import styles from './styles'

export default interface IBasicAccountInfoProps
    extends WithStyles<typeof styles, true> {
    accountIsVerified: boolean
    account: any
    isSaving: boolean
    saveAccountInfo(data: any): void
}
