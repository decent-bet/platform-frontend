import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    Button,
    Grid,
    CardActions,
    CardContent,
    Typography,
    TextField
} from '@material-ui/core'
import ReCaptcha from '../../common/components/ReCaptcha'
import * as thunks from '../state/thunks'
import actions from '../state/actions'
import { VIEW_FORGOT_PASSWORD, VIEW_SIGNUP, VIEW_MAIN } from '../../routes'
import LoadingButton from '../../common/components/LoadingButton'

class Login extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public componentDidMount() {
        this.props.setDefaultStatus()
    }

    public state = {
        formData: {
            email: '',
            password: ''
        },
        errors: {
            email: false,
            password: false,
            recaptchaKey: false
        },
        errorsMessages: {
            email: '',
            password: '',
            recaptchaKey: ''
        }
    }

    private onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let { formData, errorsMessages, errors } = this.state
        const value = event.target.value
        const name = event.target.name

        formData[name] = value
        if (!event.target.validity.valid || !value || value.length < 4) {
            errorsMessages[name] = event.target.validationMessage
            errors[name] = true
        } else {
            errorsMessages[name] = ''
            errors[name] = false
        }

        this.setState({ formData, errorsMessages, errors })
    }

    private get isValidCredentials() {
        let { email, password } = this.state.formData
        let { recaptchaKey } = this.props
        return (
            email.length > 3 && password.length > 4 && recaptchaKey.length > 0
        )
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        let { email, password } = this.state.formData
        let { recaptchaKey } = this.props

        if (this.props.recaptcha && this.props.recaptcha.current) {
            this.props.recaptcha.current.reset()
        }
        await this.props.makeLogin(email, password, recaptchaKey)

        this.props.history.push(VIEW_MAIN)
    }

    public render() {
        const signUpLink = props => <Link to={VIEW_SIGNUP} {...props} />
        const forgotPasswordLink = props => (
            <Link to={VIEW_FORGOT_PASSWORD} {...props} />
        )

        return (
            <React.Fragment>
                <CardContent>
                    <Typography
                        variant="headline"
                        align="center"
                        style={{ fontWeight: 'lighter' }}
                    >
                        Please login to continue
                    </Typography>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            error={this.state.errors.email}
                            value={this.state.formData.email}
                            required={true}
                            fullWidth={true}
                            onChange={this.onValueChange}
                            helperText={this.state.errorsMessages.email}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="none"
                            error={this.state.errors.password}
                            value={this.state.formData.password}
                            onChange={this.onValueChange}
                            required={true}
                            fullWidth={true}
                            helperText={this.state.errorsMessages.password}
                        />

                        <Typography variant="subheading">
                            Forgot your password ?
                            <Button
                                component={forgotPasswordLink}
                                disableRipple={true}
                                color="primary"
                                style={{
                                    textTransform: 'none',
                                    margin: '0 !important'
                                }}
                            >
                                Click here
                            </Button>
                        </Typography>

                        <ReCaptcha
                            onChange={this.props.setRecaptchaKey}
                            onReceiveRecaptchaInstance={
                                this.props.setRecaptchaInstance
                            }
                        />

                        <p>
                            <LoadingButton
                                isLoading={this.props.loading}
                                color="primary"
                                variant="contained"
                                type="submit"
                                fullWidth={true}
                                disabled={
                                    !this.isValidCredentials ||
                                    this.props.loading
                                }
                            >
                                Login
                            </LoadingButton>
                        </p>
                    </form>
                </CardContent>
                <CardActions>
                    <Grid
                        container={true}
                        direction="column"
                        alignItems="center"
                        spacing={16}
                    >
                        <Grid item={true} xs={12}>
                            <Typography variant="body2">
                                Don’t have an account?
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Button
                                color="secondary"
                                variant="contained"
                                component={signUpLink}
                            >
                                Create New Account
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks, actions.auth), dispatch)

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
export default LoginContainer