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
import * as thunks from '../state/thunks'
import { VIEW_LOGIN } from '../../routes'
import ReCaptcha from '../../common/components/ReCaptcha'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class SignUp extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public state = {
        formData: {
            email: '',
            password: '',
            confirmPassword: '',
            recaptchaKey: ''
        },
        errors: {
            email: false,
            password: false,
            confirmPassword: false,
            recaptcha: false
        },
        errorsMessages: {
            email: '',
            password: '',
            confirmPassword: '',
            recaptcha: ''
        },
        isValidCredentials: false
    }

    private isValidCredentials = formData => {
        let { email, password, recaptchaKey } = formData
        const isValidCredentials =
            email.length > 3 && password.length > 4 && recaptchaKey.length > 0

        return isValidCredentials
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
            errorsMessages[name] = ''
            errors[name] = false
        }

        let { email, password, recaptchaKey } = formData
        const isValidCredentials =
            email.length > 3 && password.length > 4 && recaptchaKey.length > 0

        this.setState({ formData, errorsMessages, errors, isValidCredentials })
    }

    private handleSubmit = () => {
        console.log('submit')
        this.props
            .dispatch(thunks.login(this.state.formData))
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

    private didClickOnLogin = () => {
        this.props.history.push(VIEW_LOGIN)
    }

    private onRecapchaKeyChange = key => {
        let { formData } = this.state
        formData.recaptchaKey = key || ''
        const isValidCredentials = this.isValidCredentials(formData)
        this.setState({ formData, isValidCredentials })
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
                        Create New Account
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
                        <TextField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            error={this.state.errors.confirmPassword}
                            value={this.state.formData.confirmPassword}
                            onChange={this.onValueChange}
                            required={true}
                            fullWidth={true}
                            helperText={
                                this.state.errorsMessages.confirmPassword
                            }
                        />

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
                                    'Create New Account'
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
                                Already have an account?
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
                                onClick={this.didClickOnLogin}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </React.Fragment>
        )
    }
}

// Connect this component to Redux
export default connect((state: any) => state.auth)(SignUp)
