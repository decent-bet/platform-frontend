import * as React from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Grid,
    CardActions,
    CardContent,
    Typography,
    TextField
} from '@material-ui/core'
import ReCaptcha from '../../common/components/ReCaptcha'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as thunks from '../state/thunks'
import { VIEW_FORGOT_PASSWORD, VIEW_SIGNUP } from '../../routes'

class Login extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public state = {
        formData: {
            email: '',
            password: '',
            recaptchaKey: ''
        },
        errors: {
            email: false,
            password: false,
            recaptcha: false
        },
        errorsMessages: {
            email: '',
            password: '',
            recaptcha: ''
        },
        isValidCredentials: false
    }

    private didClicOnSignUp = () => {
        this.props.history.push(VIEW_SIGNUP)
    }

    private didClicOnForgotPassword = () => {
        this.props.history.push(VIEW_FORGOT_PASSWORD)
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
        const isValidCredentials = this.isValidCredentials(formData)
        this.setState({ formData, errorsMessages, errors, isValidCredentials })
    }

    private isValidCredentials = formData => {
        let { email, password, recaptchaKey } = formData
        const isValidCredentials =
            email.length > 3 && password.length > 4 && recaptchaKey.length > 0

        return isValidCredentials
    }

    private onRecapchaKeyChange = key => {
        let { formData } = this.state
        formData.recaptchaKey = key || ''
        const isValidCredentials = this.isValidCredentials(formData)
        this.setState({ formData, isValidCredentials })
    }

    private handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        let { formData } = this.state
        this.props
            .dispatch(thunks.login(formData))
            .then(() => {
                this.props.history.push('/')
            })
            .catch(error => {
                console.log(error)
            })
    }

    public render() {
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
                                onClick={this.didClicOnForgotPassword}
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
                        <Grid
                            container={true}
                            direction="column"
                            justify="center"
                            alignItems="center"
                            style={{ paddingTop: '1em', paddingBottom: '1em' }}
                        >
                            <Grid item={true} xs={12}>
                                <ReCaptcha
                                    onChange={this.onRecapchaKeyChange}
                                />
                            </Grid>
                        </Grid>
                        <p>
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth={true}
                                disabled={
                                    !this.state.isValidCredentials ||
                                    this.props.loading
                                }
                                type="submit"
                            >
                                {this.props.loading ? (
                                    <FontAwesomeIcon icon="spinner" />
                                ) : (
                                    'Login'
                                )}
                            </Button>
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
                        <Grid
                            item={true}
                            xs={12}
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={this.didClicOnSignUp}
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

// Connect this component to Redux
export default connect((state: any) => state.auth)(Login)
