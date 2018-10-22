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
import { makeLogin } from '../state/thunks'
import * as validator from 'validator'
import { VIEW_FORGOT_PASSWORD, VIEW_SIGNUP, VIEW_MAIN } from '../../routes'
import LoadingButton from '../../common/components/LoadingButton'
import Recaptcha from '../../common/components/Recaptcha'
import { ILoginState, LoginState } from './LoginState'

class Login extends React.Component<any, ILoginState> {
    private recaptcha: any

    constructor(props: any) {
        super(props)
        this.state = new LoginState()
        this.onValueChange = this.onValueChange.bind(this)
        this.isValidDataInput = this.isValidDataInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onCaptchaKeyChange = this.onCaptchaKeyChange.bind(this)
    }

    private onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let { formData, errorsMessages, errors } = this.state
        const value = event.target.value
        const name = event.target.name

        formData[name] = value
        if (!event.target.validity.valid || !value || value.length < 4) {
            errorsMessages[name] = event.target.validationMessage
            errors[name] = true
        } else {
            const validation = this.isValidDataInput(name, value)
            errorsMessages[name] = validation.message
            errors[name] = validation.error
        }

        this.setState({ formData, errorsMessages, errors })
    }

    private isValidDataInput(
        inputName: string,
        value: string
    ): { error: boolean; message: string } {
        let isVAlid: boolean
        let message: string

        switch (inputName) {
            case 'email':
                isVAlid =
                    validator.isEmail(value) &&
                    validator.isLength(value, { min: 3, max: 100 })
                message = 'The email is not valid'
                break
            case 'password':
                isVAlid = validator.isLength(value, { min: 6, max: 100 })
                message = 'Invalid password'
                break
            case 'recaptchaKey':
                isVAlid = validator.isLength(value, { min: 10 })
                message = 'Invalid recaptcha Key'
                break
            default:
                isVAlid = false
                message = ''
                break
        }

        return { error: !isVAlid, message: !isVAlid ? message : '' }
    }

    private get formHasError() {
        const isValidEmail = this.isValidDataInput(
            'email',
            this.state.formData.email
        )
        const isValidPassword = this.isValidDataInput(
            'password',
            this.state.formData.password
        )
        const isValidRecaptcha = this.isValidDataInput(
            'recaptchaKey',
            this.state.formData.recaptchaKey
        )
        return (
            isValidEmail.error ||
            isValidPassword.error ||
            isValidRecaptcha.error
        )
    }

    private async handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        let { email, password, recaptchaKey } = this.state.formData
        if (this.recaptcha) {
            this.recaptcha.reset()
        }
        const result = await this.props.makeLogin(email, password, recaptchaKey)
        if (result && result.value && result.value.error === true) {
            this.props.history.push(VIEW_MAIN)
        }
    }

    private onCaptchaKeyChange(key: string) {
        let { formData, errors, errorsMessages } = this.state
        formData.recaptchaKey = key

        const validation = this.isValidDataInput('recaptchaKey', key)
        errors.recaptchaKey = validation.error
        errorsMessages.recaptchaKey = validation.message

        this.setState({ formData, errorsMessages, errors })
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
                        <Recaptcha onKeyChange={this.onCaptchaKeyChange} />
                        <p>
                            <LoadingButton
                                isLoading={this.state.loading}
                                color="primary"
                                variant="contained"
                                type="submit"
                                fullWidth={true}
                                disabled={
                                    this.formHasError || this.state.loading
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

const mapStateToProps = state => Object.assign({}, state.auth.login)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, { makeLogin }), dispatch)

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
export default LoginContainer
