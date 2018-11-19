import IChannelBackendError from '../../common/types/IChannelsBackendError'
import styles from './styles'
import { WithStyles } from '@material-ui/core'

export default interface IChannelBackendErrorModalProps
    extends WithStyles<typeof styles> {
    error: IChannelBackendError
    open: boolean
    handleClose(): void
}
