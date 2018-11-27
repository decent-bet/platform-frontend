import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Checkbox
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import actions from '../state/actions'
import Recaptcha from '../../common/components/Recaptcha'
import LoadingButton from '../../common/components/LoadingButton'
import { ISignUpState, SignUpState } from './SignUpState'
import {
    VIEW_LOGIN,
    VIEW_TERMS_AND_CONDITIONS,
    VIEW_PRIVACY_POLICY
} from '../../routes'
import {
    PASSWORD_VALIDATION_PATTERN,
    INVALID_PASSWORD_MESSAGE
} from '../../constants'
import AuthResult from '../AuthResult'
import ISignUpProps from './ISignUpProps'
import * as validator from 'validator'

class SignUp extends React.Component<ISignUpProps, ISignUpState> {
    private recaptchaRef: any
    constructor(props: ISignUpProps) {
        super(props)
        this.state = new SignUpState()
        this.onCaptchaKeyChange = this.onCaptchaKeyChange.bind(this)
        this.onSetRecaptchaRef = this.onSetRecaptchaRef.bind(this)
        this.handleAcceptedTerms = this.handleAcceptedTerms.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderForm = this.renderForm.bind(this)
        this.isValidDataInput = this.isValidDataInput.bind(this)
    }

    private onSetRecaptchaRef(recaptchaRef: any): void {
        this.recaptchaRef = recaptchaRef
    }

    private onCaptchaKeyChange(key: string) {
        let { recaptchaKey } = this.state
        recaptchaKey = key
        this.setState({ recaptchaKey })
    }

    private get isValidCredentials() {
        let {
            email,
            password,
            acceptedTerms,
            passwordConfirmation,
            recaptchaKey
        } = this.state

        const emailValid = this.isValidDataInput('email', email)
        const acceptedTermsValid = this.isValidDataInput(
            'acceptedTerms',
            acceptedTerms
        )
        const passwordValid = this.isValidDataInput('password', password)
        const recaptchaKeyValid = this.isValidDataInput(
            'recaptchaKey',
            recaptchaKey
        )
        const passwordConfirmationValid = this.isValidDataInput(
            'passwordConfirmation',
            passwordConfirmation
        )
        return (
            emailValid.valid &&
            acceptedTermsValid.valid &&
            passwordValid.valid &&
            recaptchaKeyValid.valid &&
            passwordConfirmationValid.valid
        )
    }

    private handleAcceptedTerms(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist()
        let { acceptedTerms, errorMessages, errors } = this.state
        acceptedTerms = event.target.checked

        const validation = this.isValidDataInput('acceptedTerms', acceptedTerms)
        errorMessages.acceptedTerms = validation.message
        errors.acceptedTerms = !validation.valid
        this.setState({ acceptedTerms, errorMessages, errors })
    }

    private isValidDataInput(
        inputName: string,
        value: any
    ): { valid: boolean; message: string } {
        const successResult = { valid: true, message: '' }
        switch (inputName) {
            case 'email':
                if (validator.isEmail(value)) {
                    return successResult
                } else {
                    return {
                        valid: false,
                        message: 'The email format is not valid.'
                    }
                }
            case 'acceptedTerms':
                if (value === true) {
                    return successResult
                } else {
                    return {
                        valid: false,
                        message:
                            'You must accept the Terms and Conditions and Privacy Policy.'
                    }
                }
            case 'recaptchaKey':
                if (validator.isLength(value, { min: 20, max: 500 })) {
                    return successResult
                } else {
                    return {
                        valid: false,
                        message: 'You must check the recaptcha.'
                    }
                }
            case 'password':
                if (validator.matches(value, PASSWORD_VALIDATION_PATTERN)) {
                    return successResult
                } else {
                    return {
                        valid: false,
                        message: INVALID_PASSWORD_MESSAGE
                    }
                }
            case 'passwordConfirmation':
                if (value !== this.state.password) {
                    return {
                        valid: false,
                        message:
                            'The password confirmation should be equals to the password'
                    }
                } else {
                    return { valid: true, message: '' }
                }
            default:
                return { valid: true, message: '' }
        }
    }

    private onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let { errorMessages, errors } = this.state
        const { name, value } = event.target

        if (!event.target.validity.valid || !value || value.length < 4) {
            errorMessages[name] = event.target.validationMessage
            errors[name] = true
        } else {
            errorMessages[name] = ''
            errors[name] = false
        }

        const validation = this.isValidDataInput(name, value)
        errorMessages[name] = validation.message
        errors[name] = validation.valid ? false : true

        let newState = { errorMessages, errors }
        newState[name] = value
        this.setState(newState)
    }

    public componentWillUnmount() {
        this.setState({ formSubmited: false })
    }

    private async handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        const {
            email,
            password,
            passwordConfirmation,
            recaptchaKey
        } = this.state

        if (this.recaptchaRef) {
            this.recaptchaRef.reset()
            this.setState({
                recaptchaKey: ''
            })
        }

        await this.props.signUp(
            email,
            password,
            passwordConfirmation,
            recaptchaKey
        )

        this.setState({ formSubmited: true })
    }

    private renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="off"
                    error={this.state.errors.email}
                    value={this.state.email}
                    required={true}
                    fullWidth={true}
                    onChange={this.onValueChange}
                    helperText={this.state.errorMessages.email}
                />

                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    autoComplete="off"
                    error={this.state.errors.password}
                    value={this.state.password}
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
                    value={this.state.passwordConfirmation}
                    onChange={this.onValueChange}
                    required={true}
                    fullWidth={true}
                    helperText={this.state.errorMessages.passwordConfirmation}
                />
                <Recaptcha
                    onSetRef={this.onSetRecaptchaRef}
                    onKeyChange={this.onCaptchaKeyChange}
                />
                <FormControl
                    fullWidth={true}
                    required={true}
                    error={this.state.errors.acceptedTerms}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                icon={
                                    <CheckBoxOutlineBlankIcon fontSize="large" />
                                }
                                checkedIcon={<CheckBoxIcon fontSize="large" />}
                                checked={this.state.acceptedTerms}
                                onChange={this.handleAcceptedTerms}
                                value="accepted"
                                color="primary"
                                disabled={this.props.loading}
                            />
                        }
                        label={
                            <Typography
                                component="span"
                                variant="subtitle1"
                                align="center"
                            >
                                I agree to the{' '}
                                <Button
                                    size="small"
                                    color="primary"
                                    target="_blank"
                                    href={VIEW_TERMS_AND_CONDITIONS}
                                >
                                    Terms and Conditions
                                </Button>{' '}
                                and{' '}
                                <Button
                                    size="small"
                                    color="primary"
                                    target="_blank"
                                    href={VIEW_PRIVACY_POLICY}
                                >
                                    Privacy Policy
                                </Button>
                            </Typography>
                        }
                    />
                    <FormHelperText>
                        {this.state.errorMessages.acceptedTerms}
                    </FormHelperText>
                </FormControl>
                <p>
                    <LoadingButton
                        style={{ marginTop: '1em' }}
                        isLoading={this.props.loading}
                        color="primary"
                        variant="contained"
                        fullWidth={true}
                        disabled={
                            !this.isValidCredentials || this.props.loading
                        }
                        type="submit"
                    >
                        Create New Account
                    </LoadingButton>
                </p>
            </form>
        )
    }

    public render() {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />

        return (
            <React.Fragment>
                {this.props.processed && this.state.formSubmited ? (
                    <AuthResult message={this.props.resultMessage} />
                ) : (
                    <React.Fragment>
                        <Typography
                            variant="h5"
                            align="center"
                            style={{ fontWeight: 'lighter' }}
                        >
                            Create New Account
                        </Typography>
                        {this.renderForm()}
                    </React.Fragment>
                )}
                <Grid
                    container={true}
                    direction="column"
                    alignItems="center"
                    spacing={16}
                >
                    <Grid item={true} xs={12}>
                        <Typography variant="body1">
                            {this.props.processed
                                ? 'Go to the login'
                                : 'Already have an account?'}
                        </Typography>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Button
                            color="secondary"
                            variant="contained"
                            component={loginLink}
                        >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth.signUp)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp)
