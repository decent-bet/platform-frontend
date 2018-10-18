import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, TextField, CircularProgress } from '@material-ui/core'
import actions from '../state/actions'
import ReCaptcha from '../../common/components/ReCaptcha'

class SignUpForm extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    public state = {
        formData: {
            email: '',
            password: '',
            passwordConfirmation: ''
        },
        errors: {
            email: false,
            password: false,
            passwordConfirmation: false
        },
        errorMessages: {
            email: '',
            password: '',
            passwordConfirmation: ''
        }
    }

    private get isValidCredentials() {
        let { email, password, passwordConfirmation } = this.state.formData
        let { recaptchaKey } = this.props

        return (
            email.length > 3 &&
            password.length > 4 &&
            recaptchaKey.length > 0 &&
            passwordConfirmation === password
        )
    }

    private onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let { formData, errorMessages, errors } = this.state
        const value = event.target.value
        const name = event.target.name

        formData[name] = value
        if (name === 'passwordConfirmation') {
            if (value !== this.state.formData.password) {
                errorMessages.passwordConfirmation =
                    'The password confirmation should be equals to the password'
                errors.passwordConfirmation = true
            } else {
                errorMessages.passwordConfirmation = ''
                errors.passwordConfirmation = false
            }
        } else {
            if (!event.target.validity.valid || !value || value.length < 4) {
                errorMessages[name] = event.target.validationMessage
                errors[name] = true
            } else {
                errorMessages[name] = ''
                errors[name] = false
            }
        }

        this.setState({ formData, errorMessages, errors })
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        let { email, password, passwordConfirmation } = this.state.formData
        const { signUp, recaptchaKey } = this.props as any
        if (this.props.recaptcha && this.props.recaptcha.current) {
            this.props.recaptcha.current.reset()
        }
        await signUp(email, password, passwordConfirmation, recaptchaKey)

        if (this.props.recapcha && this.props.recapcha.current) {
            this.props.recapcha.current.reset()
        }

        this.setState({
            formData: {
                email: '',
                password: '',
                passwordConfirmation: ''
            }
        })
    }

    public render() {
        let { loading } = this.props as any
        return (
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
                    helperText={this.state.errorMessages.email}
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
                    helperText={this.state.errorMessages.password}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    autoComplete="none"
                    name="passwordConfirmation"
                    error={this.state.errors.passwordConfirmation}
                    value={this.state.formData.passwordConfirmation}
                    onChange={this.onValueChange}
                    required={true}
                    fullWidth={true}
                    helperText={this.state.errorMessages.passwordConfirmation}
                />
                <ReCaptcha
                    onChange={this.props.setRecaptchaKey}
                    onReceiveRecaptchaInstance={this.props.setRecaptchaInstance}
                />
                <p>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth={true}
                        disabled={!this.isValidCredentials || loading}
                        type="submit"
                    >
                        {loading ? (
                            <CircularProgress color="secondary" size={24} />
                        ) : (
                            'Create New Account'
                        )}
                    </Button>
                </p>
            </form>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

const SignUpFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpForm)
export default SignUpFormContainer
