import * as React from 'react'
import { connect } from 'react-redux'
import {
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@material-ui/core'

class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { open: false, hasError: false, info: null, error: null }
        this.handleClose = this.handleClose.bind(this)
    }

    public componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ open: true, hasError: true, error, info })
    }

    public shouldComponentUpdate(_nextProps, _nextState) {
        return !this.state.open
    }

    private handleClose() {
        this.setState({ open: false })
    }

    public render() {
        if (this.state.hasError) {
            let { message } = this.state.error
            return (
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="error-title"
                >
                    <DialogTitle color="error">Unexpected Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText component="div">
                            <Typography
                                color="textSecondary"
                                variant="subtitle1"
                            >
                                {message}
                            </Typography>
                            <br />
                            Component stack:
                            <Typography color="primary" variant="caption">
                                <code>
                                    {JSON.stringify(
                                        this.state.info.componentStack
                                    )}
                                </code>
                            </Typography>
                            <br />
                            Stack:
                            <Typography color="primary" variant="caption">
                                <code>
                                    {JSON.stringify(this.state.error.stack)}
                                </code>
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            )
        }
        return this.props.children
    }
}

const mapStateToProps = state => Object.assign({}, {})

const ErrorBoundaryContainer = connect(mapStateToProps)(ErrorBoundary)
export default ErrorBoundaryContainer
