import * as React from 'react'
import { connect } from 'react-redux'
import {
    Avatar,
    Slide,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    TextField,
    Grid,
    withStyles,
    Typography,
    WithStyles,
    createStyles
} from '@material-ui/core'
import { authWallet } from '../state/thunks'
import logo from '../../assets/img/ic_coin.png'
import LoadingButton from 'src/common/components/LoadingButton'

function Transition(props) {
    return <Slide direction="down" {...props} />
}

const styles = () =>
    createStyles({
        root: {
            zIndex: 1
        },
        content: {
            padding: '1em'
        },
        actions: {
            paddingBottom: '0.5em'
        },
        avatar: {
            margin: 10,
            width: 80,
            height: 80
        },
        title: {},
        contentText: {
            paddingBottom: '1.2em'
        }
    })

export interface ILoginProps extends WithStyles<typeof styles> {
    onLoginSuccess: () => void
    account: any
}

class Login extends React.Component<ILoginProps, any> {
    constructor(props: ILoginProps) {
        super(props)
        this.state = {
            open: true,
            processing: false,
            loginValue: '',
            hasError: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.onLoginTextChangedListener = this.onLoginTextChangedListener.bind(
            this
        )
    }

    private async handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        this.setState({ processing: true })
        const { dispatch } = this.props as any

        try {
            await dispatch(
                authWallet(this.state.loginValue, this.props.account)
            )
            this.setState({ processing: false })
            this.props.onLoginSuccess()
        } catch (error) {
            this.setState({ processing: false })
        }
    }

    get isValidCredentials() {
        return this.state.value.length > 0
    }

    private handleClose = () => {
        this.setState({ open: false })
    }

    private onLoginTextChangedListener(event): void {
        this.setState({ loginValue: event.target.value })
    }

    public render() {
        return (
            <Dialog
                className={this.props.classes.root}
                open={this.state.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
            >
                <form onSubmit={this.handleSubmit}>
                    <DialogTitle className={this.props.classes.title}>
                        <Grid
                            container={true}
                            direction="row"
                            alignItems="center"
                            spacing={16}
                        >
                            <Grid item={true}>
                                <Avatar
                                    src={logo}
                                    className={this.props.classes.avatar}
                                />
                            </Grid>
                            <Grid item={true}>
                                <Typography variant="title">
                                    Play on the Casino
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent className={this.props.classes.content}>
                        <DialogContentText
                            className={this.props.classes.contentText}
                        >
                            To Play on the Casino whe need to confirm your
                            Passphrase or Private Key
                        </DialogContentText>
                        <TextField
                            className="input"
                            type="text"
                            fullWidth={true}
                            multiline={true}
                            label="Enter Passphrase or Private Key"
                            value={this.state.loginValue}
                            onChange={this.onLoginTextChangedListener}
                        />
                    </DialogContent>
                    <DialogActions className={this.props.classes.actions}>
                        <LoadingButton
                            isLoading={this.state.processing}
                            variant="raised"
                            color="primary"
                            disabled={this.state.hasError}
                            type="submit"
                        >
                            Enter to Casino
                        </LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        )
    }
}

const styledLoginComponent = withStyles(styles)(Login)
const mapStateToProps = state => Object.assign({}, state.casino)

const LoginContainer = connect(mapStateToProps)(styledLoginComponent)

export default LoginContainer
