import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../state/actions'
import { Button, Grid, TextField, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { VIEW_LOGIN } from '../../routes'
import AuthResult from '../AuthResult'
import IResetPasswordProps from './IResetPasswordProps'
import { IResetPasswordState, ResetPasswordState } from './ResetPasswordState'
import Recaptcha from '../../common/components/Recaptcha'
import LoadingButton from '../../common/components/LoadingButton'
import AppLoading from '../../common/components/AppLoading'

class ResetPassword extends React.Component<
    IResetPasswordProps,
    IResetPasswordState
> {
    private recaptchaRef: any

    constructor(props) {
        super(props)
        this.state = new ResetPasswordState()
        this.onCaptchaKeyChange = this.onCaptchaKeyChange.bind(this)
        this.onSetRecaptchaRef = this.onSetRecaptchaRef.bind(this)
        this.renderForm = this.renderForm.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
    }

    public async componentDidMount() {
        let { id, key } = this.props.match.params
        this.setState({ id, key })
        await this.props.resetPasswordVerify(id, key)
    }

    public componentWillUnmount() {
        this.setState(new ResetPasswordState())
    }

    private get formHasError() {
        if (
            this.state.password.length < 4 ||
            this.state.recaptchaKey.length < 4 ||
            this.state.error
        ) {
            return true
        }
        return false
    }

    private onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value

        if (!event.target.validity.valid || !value || value.length < 4) {
            this.setState({
                errorMessage: event.target.validationMessage,
                error: true,
                password: value
            })
        } else {
            this.setState({ errorMessage: '', error: false, password: value })
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
        const { id, key, password, recaptchaKey } = this.state
        await this.props.resetPassword(id, key, password, recaptchaKey)
        this.setState({
            id: '',
            key: '',
            password: '',
            recaptchaKey: '',
            formSubmited: true
        })
        if (this.recaptchaRef) {
            this.recaptchaRef.reset()
        }
    }

    private renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    label="New Password"
                    type="password"
                    name="email"
                    autoComplete="off"
                    error={this.state.error}
                    value={this.state.password}
                    required={true}
                    fullWidth={true}
                    onChange={this.onPasswordChange}
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
        if (this.props.loading && !this.state.formSubmited) {
            return <AppLoading message="Processing password reset request..." />
        }

        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />
        return (
            <React.Fragment>
                {this.props.verified && !this.state.formSubmited ? (
                    <React.Fragment>
                        <Typography
                            variant="h5"
                            align="center"
                            style={{ fontWeight: 'lighter' }}
                        >
                            Reset your password
                        </Typography>
                        {this.renderForm()}
                    </React.Fragment>
                ) : (
                    <AuthResult message={this.props.resultMessage} />
                )}

                <Grid
                    container={true}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    spacing={16}
                >
                    <Grid item={true} xs={12}>
                        <Typography variant="body1">
                            Go to the login?{' '}
                        </Typography>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Button
                            disabled={this.props.loading}
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

const mapStateToProps = state => Object.assign({}, state.auth.resetPassword)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

const ResetPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword)
export default ResetPasswordContainer
