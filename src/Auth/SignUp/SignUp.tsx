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
import AuthResult from '../AuthResult'
import ISignUpProps from './ISignUpProps'

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
    }

    private onSetRecaptchaRef(recaptchaRef: any): void {
        this.recaptchaRef = recaptchaRef
    }

    private onCaptchaKeyChange(key: string) {
        const { formData } = this.state
        formData.recaptchaKey = key
        this.setState({ formData })
    }

    private get isValidCredentials() {
        let {
            email,
            password,
            acceptedTerms,
            passwordConfirmation,
            recaptchaKey
        } = this.state.formData

        return (
            email.length > 3 &&
            acceptedTerms &&
            password.length > 4 &&
            recaptchaKey.length > 0 &&
            passwordConfirmation === password
        )
    }

    private handleAcceptedTerms(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist()
        let { formData, errorMessages, errors } = this.state
        formData.acceptedTerms = event.target.checked
        if (formData.acceptedTerms) {
            errorMessages.acceptedTerms = ''
            errors.acceptedTerms = false
        } else {
            errorMessages.acceptedTerms =
                'You must accept the Terms and Conditions and Privacy Policy.'
            errors.acceptedTerms = true
        }
        this.setState({ formData, errorMessages, errors })
    }

    private onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
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
        } = this.state.formData

        if (this.recaptchaRef) {
            this.recaptchaRef.reset()
            let { formData } = this.state
            formData.recaptchaKey = ''
            this.setState({ formData })
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
                    autoComplete="off"
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
                                checked={this.state.formData.acceptedTerms}
                                onChange={this.handleAcceptedTerms}
                                value="accepted"
                                color="primary"
                                disabled={this.props.loading}
                            />
                        }
                        label={
                            <Typography
                                component="span"
                                variant="subheading"
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
                            variant="headline"
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
                        <Typography variant="body2">
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
