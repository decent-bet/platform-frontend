import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, TextField, CircularProgress } from '@material-ui/core'

import actions from './state/actions'

class ForgotPasswordForm extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    public state = {
        email: '',
        error: false,
        errorsMessage: ''
    }

    private get formIsValid() {
        return this.state.email.length > 4 && this.props.recaptchaKey.length > 0
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

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        let { recaptchaKey } = this.props

        if (this.props.recaptcha && this.props.recaptcha.current) {
            this.props.recaptcha.current.reset()
        }
        await this.props.forgotPassword(this.state.email, recaptchaKey)
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

                <p>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth={true}
                        disabled={!this.formIsValid || loading}
                        type="submit"
                    >
                        {loading ? (
                            <CircularProgress color="secondary" size={24} />
                        ) : (
                            'Reset Password'
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

const ForgotPasswordFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordForm)
export default ForgotPasswordFormContainer
