import * as React from 'react'
import { CHANNEL_BACKEND_ERRORS } from '../../constants'
import {
    Slide,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    Button,
    Grid,
    withStyles,
    Typography
} from '@material-ui/core'
import IChannelBackendErrorModalProps from './IChannelBackendErrorModalProps'
import styles from './styles'

function Transition(props) {
    return <Slide direction="down" {...props} />
}

class ChannelsBackendErrorModal extends React.Component<
    IChannelBackendErrorModalProps,
    any
> {
    public render() {
        const { error } = this.props
        if (!error) {
            return null
        }
        let disableClose: boolean = false
        let contentText: string = ''
        let title: string = ''

        if (error.statusCode) {
            title = error.message

            switch (error.statusCode) {
                case CHANNEL_BACKEND_ERRORS.ERROR_CODE_CHANNEL_CLOSED:
                case CHANNEL_BACKEND_ERRORS.ERROR_CODE_CHANNEL_FINALIZED:
                    contentText =
                        'The channel is finalized or closed, please go the Lobby section and initialize another channel.'
                    break
                case CHANNEL_BACKEND_ERRORS.ERROR_CODE_CHANNEL_EXPIRED:
                    contentText =
                        'The channel is expired, please go to exit slots option and initialize a new channel'
                    break
                case CHANNEL_BACKEND_ERRORS.ERROR_CODE_PROCESSING:
                case CHANNEL_BACKEND_ERRORS.ERROR_CODE_MIDDLEWARE:
                    contentText =
                        'An error ocurred processing the request, please contact our support team or try again later.'
                case CHANNEL_BACKEND_ERRORS.ERROR_CODE_REVERTED:
                    contentText =
                        'An error ocurred processing the request, the transaction was reverted by the blockchain.'
                    break
                case CHANNEL_BACKEND_ERRORS.ERROR_CODE_USER_ALREADY_CONNECTED:
                    disableClose = true
                    contentText =
                        'You are already connected in another window or tab browser. For your security, we only support one connection at the time. Please close this browser tab or window and continue in the other already open.'
                    break
                default:
                    contentText =
                        'An backend error ocurred, please contact our support team or try again later.'
                    break
            }
        } else {
            contentText = error.message
            title = 'Error'
        }

        return (
            <Dialog
                open={this.props.open}
                disableBackdropClick={disableClose}
                disableEscapeKeyDown={disableClose}
                onClose={this.props.handleClose}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    <Grid
                        container={true}
                        direction="row"
                        alignItems="center"
                        spacing={40}
                    >
                        <Grid item={true}>
                            <Typography variant="h6">{title}</Typography>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent className={this.props.classes.content}>
                    <DialogContentText
                        className={this.props.classes.contentText}
                    >
                        {contentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={this.props.classes.actions}>
                    {!disableClose ? (
                        <Button
                            onClick={this.props.handleClose}
                            variant="contained"
                            color="primary"
                            type="button"
                        >
                            OK
                        </Button>
                    ) : (
                        ' '
                    )}
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(ChannelsBackendErrorModal)
