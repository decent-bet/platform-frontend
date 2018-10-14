import * as React from 'react'
import { connect } from 'react-redux'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Grid,
    TextField,
    Button,
    withStyles,
    WithStyles,
    createStyles
} from '@material-ui/core'
import { authWallet } from '../state/thunks'
import logo from '../../assets/img/dbet-white.svg'

const styles = () =>
    createStyles({
        root: { height: '80vh' },
        grid: {
            width: '35rem',
            height: '100%'
        },
        card: {
            paddingBottom: '1em',
            paddingTop: '1em',
            marginTop: '1em',
            boxShadow:
                '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
        }
    })

export interface ILoginProps extends WithStyles<typeof styles> {
    onLoginSuccess: () => void
}

class Login extends React.Component<ILoginProps, any> {
    constructor(props: ILoginProps) {
        super(props)
        this.state = {
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
        const { dispatch } = this.props as any
        await dispatch(authWallet(this.state.loginValue))
        this.props.onLoginSuccess()
    }

    get isValidCredentials() {
        return this.state.value.length > 0
    }

    private onLoginTextChangedListener(event): void {
        this.setState({ loginValue: event.target.value })
    }

    public render() {
        return (
            <Grid
                container={true}
                className={this.props.classes.root}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid
                    item={true}
                    xs={12}
                    sm={5}
                    md={5}
                    className={this.props.classes.grid}
                >
                    <form onSubmit={this.handleSubmit}>
                        <Card className={this.props.classes.card}>
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
                                <TextField
                                    className="input"
                                    type="text"
                                    fullWidth={true}
                                    multiline={true}
                                    label="Enter Passphrase or Private Key"
                                    value={this.state.loginValue}
                                    onChange={this.onLoginTextChangedListener}
                                />
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="raised"
                                    className="login-button"
                                    color="primary"
                                    disabled={this.state.hasError}
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                </Grid>
            </Grid>
        )
    }
}

const styledLoginComponent = withStyles(styles)(Login)
const mapStateToProps = state => Object.assign({}, state.casino)

const LoginContainer = connect(mapStateToProps)(styledLoginComponent)

export default LoginContainer
