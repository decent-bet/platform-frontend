import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../state/actions'
import { Button, Grid, Typography, TextField } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { VIEW_LOGIN } from '../../routes'
import AuthResult from '../AuthResult'
import IForgotPasswordProps from './IForgotPasswordProps'
import {
    IForgotPasswordState,
    ForgotPasswordState
} from './ForgotPasswordState'
import Recaptcha from '../../common/components/Recaptcha'
import LoadingButton from '../../common/components/LoadingButton'

class ForgotPassword extends React.Component<
    IForgotPasswordProps,
    IForgotPasswordState
> {
    private recaptchaRef: any

    constructor(props: IForgotPasswordProps) {
        super(props)
        this.state = new ForgotPasswordState()
        this.onCaptchaKeyChange = this.onCaptchaKeyChange.bind(this)
        this.onSetRecaptchaRef = this.onSetRecaptchaRef.bind(this)
        this.renderForm = this.renderForm.bind(this)
        this.onEmailChange = this.onEmailChange.bind(this)
    }

    public componentWillUnmount() {
        this.setState(new ForgotPasswordState())
    }

    private get formHasError() {
        if (
            this.state.email.length < 4 ||
            this.state.recaptchaKey.length < 4 ||
            this.state.error
        ) {
            return true
        }
        return false
    }

    private onEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value

        if (!event.target.validity.valid || !value || value.length < 4) {
            this.setState({
                errorMessage: event.target.validationMessage,
                error: true,
                email: value
            })
        } else {
            this.setState({ errorMessage: '', error: false, email: value })
        }
    }

    private onCaptchaKeyChange(key: string) {
        this.setState({ recaptchaKey: key })
    }

    private onSetRecaptchaRef(recaptchaRef: any): void {
        this.recaptchaRef = recaptchaRef
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const { email, recaptchaKey } = this.state
        await this.props.forgotPassword(email, recaptchaKey)
        this.setState({ email: '', recaptchaKey: '', formSubmited: true })
        if (this.recaptchaRef) {
            this.recaptchaRef.reset()
        }
    }

    private renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="off"
                    error={this.state.error}
                    value={this.state.email}
                    required={true}
                    fullWidth={true}
                    onChange={this.onEmailChange}
                    helperText={this.state.errorMessage}
                />
                <Recaptcha
                    onSetRef={this.onSetRecaptchaRef}
                    onKeyChange={this.onCaptchaKeyChange}
                />
                <p>
                    <LoadingButton
                        isLoading={this.props.loading}
                        color="primary"
                        variant="contained"
                        fullWidth={true}
                        disabled={this.formHasError || this.props.loading}
                        type="submit"
                    >
                        Reset Password
                    </LoadingButton>
                </p>
            </form>
        )
    }
    public render() {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />

        return (
            <React.Fragment>
                <Typography
                    variant="headline"
                    align="center"
                    style={{ fontWeight: 'lighter' }}
                >
                    Forgot your password ?
                </Typography>
                {this.state.formSubmited ? (
                    <AuthResult message={this.props.resultMessage} />
                ) : (
                    this.renderForm()
                )}
                <Grid
                    container={true}
                    direction="column"
                    alignItems="center"
                    spacing={16}
                >
                    <Grid item={true} xs={12}>
                        <Typography variant="body2">Want to login?</Typography>
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

const mapStateToProps = state => Object.assign({}, state.auth.forgotPassword)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassword)
