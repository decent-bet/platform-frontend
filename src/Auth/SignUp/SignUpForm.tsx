import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TextField } from '@material-ui/core'
import actions from '../state/actions'
import Recaptcha from '../../common/components/Recaptcha'
import LoadingButton from '../../common/components/LoadingButton'

class SignUpForm extends React.Component<any> {
    private recaptchaRef: any
    constructor(props: any) {
        super(props)
        this.onCaptchaKeyChange = this.onCaptchaKeyChange.bind(this)
        this.onSetRecaptchaRef = this.onSetRecaptchaRef.bind(this)
    }

    public state = {
        formData: {
            email: '',
            password: '',
            recaptchaKey: '',
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

    private onSetRecaptchaRef(recaptchaRef: any): void {
        this.recaptchaRef = recaptchaRef
    }

    private onCaptchaKeyChange(key: string) {
        this.setState({ recaptchaKey: key })
    }

    private get isValidCredentials() {
        let {
            email,
            password,
            passwordConfirmation,
            recaptchaKey
        } = this.state.formData

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

        let {
            email,
            password,
            passwordConfirmation,
            recaptchaKey
        } = this.state.formData
        const { signUp } = this.props as any
        if (this.recaptchaRef) {
            this.recaptchaRef.reset()
        }
        await signUp(email, password, passwordConfirmation, recaptchaKey)

        this.setState({
            formData: {
                email: '',
                password: '',
                passwordConfirmation: '',
                recaptchaKey: ''
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
                <Recaptcha
                    onSetRef={this.onSetRecaptchaRef}
                    onKeyChange={this.onCaptchaKeyChange}
                />
                <p>
                    <LoadingButton
                        isLoading={loading}
                        color="primary"
                        variant="contained"
                        fullWidth={true}
                        disabled={!this.isValidCredentials || loading}
                        type="submit"
                    >
                        'Create New Account
                    </LoadingButton>
                </p>
            </form>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth.signUp)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions), dispatch)

const SignUpFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpForm)
export default SignUpFormContainer
