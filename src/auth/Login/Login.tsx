import * as React from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Card,
    Grid,
    CardHeader,
    CardActions,
    CardContent,
    Typography
} from '@material-ui/core'
import ConfirmationDialog from '../../shared/dialogs/ConfirmationDialog'
import * as Thunks from '../thunks'
import logo from '../../assets/img/dbet-white.svg'

class Login extends React.Component<any> {
    public state = {
        email: '',
        password: '',
        recaptchaKey: '',
        isErrorDialogOpen: false
    }

    private login = () => {
        this.props
            .dispatch(
                Thunks.login(
                    this.state.email,
                    this.state.password,
                    this.state.recaptchaKey
                )
            )
            .then(() => {
                // Go to the Root
                this.props.history.push('/')
            })
            .catch(error => {
                this.setState({
                    isErrorDialogOpen: true
                })
            })
    }

    private isValidCredentials() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.recaptchaKey.length > 0
        )
    }

    public onLoginListener = e => {
        e.preventDefault()
        if (this.isValidCredentials()) {
            this.login()
        } else {
            this.setState({
                isErrorDialogOpen: true
            })
        }
    }

    private onCloseErrorDialogListener = () => {
        this.setState({ isErrorDialogOpen: false })
    }

    public render() {
        return (
            <Grid
                container={true}
                style={{ height: '95vh', overflow:"hidden"}}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item={true} xs={12} sm={3} md={5} justify="center">
                <Card>
                            <CardHeader
                                avatar={
                                    <img
                                        src={logo}
                                        alt="Decent.bet Logo"
                                        style={{ maxHeight: 26 }}
                                    />
                                }
                            />
                            <CardContent>
                                <Grid
                                    container={true}
                                    spacing={24}
                                    direction="column"
                                    alignItems="center"
                                >
                                    <Grid
                                        item={true}
                                        xs={12}
                                        alignContent="center"
                                    >
                                        <Typography
                                            variant="title"
                                            align="center"
                                        >
                                            Please login to continue
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item={true}
                                        xs={12}
                                        alignContent="center"
                                    >
                                        <Typography
                                            variant="title"
                                            align="center"
                                        >
                                            Please login to continue
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Typography component="p">
                                    This impressive paella is a perfect party
                                    dish and a fun meal to cook together with
                                    your guests. Add 1 cup of frozen peas along
                                    with the mussels, if you like.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    fullWidth={true}
                                >
                                    Login
                                </Button>
                            </CardActions>
                        </Card>
                        <ConfirmationDialog
                            onClick={this.onCloseErrorDialogListener}
                            onClose={this.onCloseErrorDialogListener}
                            title="Invalid Login"
                            message="Please make sure you're entering a valid Private Key or Passphase"
                            open={this.state.isErrorDialogOpen}
                        />
                </Grid>
            </Grid>
        )
    }
}

// Connect this component to Redux
export default connect(state => state)(Login)
