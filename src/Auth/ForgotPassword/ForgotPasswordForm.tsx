import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { TextField } from '@material-ui/core'
import Recaptcha from '../../common/components/Recaptcha'
import LoadingButton from '../../common/components/LoadingButton'
import actions from '../state/actions'

class ForgotPasswordForm extends React.Component<any> {
    private recaptcha: any

    constructor(props: any) {
        super(props)
        this.onCaptchaKeyChange = this.onCaptchaKeyChange.bind(this)
    }

    public state = {
        email: '',
        recaptchaKey: '',
        error: false,
        errorsMessage: ''
    }

    private get formHasError() {
        return this.state.email.length < 4 && this.state.recaptchaKey.length < 4
    }

    private onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (this.recaptcha) {
            this.recaptcha.reset()
        }
        await this.props.forgotPassword(
            this.state.email,
            this.state.recaptchaKey
        )
        this.setState({ email: '' })
    }

    public render() {
        let { loading } = this.props as any
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    error={this.state.error}
                    value={this.state.email}
                    required={true}
                    fullWidth={true}
                    onChange={this.onEmailChange}
                    helperText={this.state.errorsMessage}
                />
                <Recaptcha onKeyChange={this.onCaptchaKeyChange} />
                <p>
                    <LoadingButton
                        isLoading={loading}
                        color="primary"
                        variant="contained"
                        fullWidth={true}
                        disabled={this.formHasError || loading}
                        type="submit"
                    >
                        Reset Password
                    </LoadingButton>
                </p>
            </form>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

const ForgotPasswordFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordForm)
export default ForgotPasswordFormContainer
