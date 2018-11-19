import * as React from 'react'
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
        return (
            <Dialog
                open={this.props.open}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onClose={this.props.handleClose}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    <Grid
                        container={true}
                        direction="row"
                        alignItems="center"
                        spacing={16}
                    >
                        <Grid item={true}>
                            <Typography variant="h6">
                                Play on the Casino
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent className={this.props.classes.content}>
                    <DialogContentText
                        className={this.props.classes.contentText}
                    >
                        test
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={this.props.classes.actions}>
                    <Button
                        onClick={this.props.handleClose}
                        variant="contained"
                        color="primary"
                        type="button"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(ChannelsBackendErrorModal)
