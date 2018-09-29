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
import * as Thunks from '../state/thunks'

class ForgotPassword extends React.Component<any> {
    
    constructor(props) {
        super(props)
        this.login = this.login.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.didClickOnLogin = this.didClickOnLogin.bind(this)
        this.onCloseErrorDialogListener = this.onCloseErrorDialogListener.bind(this)
    }

    public state = {
        formData: { email: '',
                    password: '',
                    recaptchaKey: ''},
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
        isValidCredentials: false,
        isErrorDialogOpen: false
    }

    private login() {
        this.props
            .dispatch(
                Thunks.login(this.state.formData)
            )
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

    private onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let { formData, errorsMessages, errors } = this.state
        const value = event.target.value
        const name = event.target.name

        formData[name] = value
        if(!event.target.validity.valid || !value || value.length < 4) {
            errorsMessages[name] = event.target.validationMessage
            errors[name] = true
        }else {
            errorsMessages[name] = ''
            errors[name] = false
        }

        let {email, password, recaptchaKey } = formData
        const isValidCredentials = (
            email.length > 3 &&
            password.length > 4 &&
            recaptchaKey.length > 0
        )

        this.setState({ formData, errorsMessages, errors, isValidCredentials})
    }
    
    private didClickOnLogin(event: React.MouseEvent){
        event.preventDefault()
        this.login()
    }


    private onCloseErrorDialogListener = () => {
        this.setState({ isErrorDialogOpen: false })
    }

    public render() {
        return (
            <React.Fragment>
                <CardContent>
                            <Typography variant="headline"
                                        align="center"
                                        style={{fontWeight: 'lighter'}}>                                                
                                        Please login to continue
                            </Typography>
                            <TextField label="Email" 
                                        type="email" 
                                        name="email"
                                        error={this.state.errors.email}
                                        value={this.state.formData.email} 
                                        required={true} 
                                        fullWidth={true} 
                                        onChange={this.onValueChange}
                                        helperText={this.state.errorsMessages.email}/>

                            <TextField label="Password" 
                                        type="password" 
                                        name="password"
                                        error={this.state.errors.password}
                                        value={this.state.formData.password} 
                                        onChange={this.onValueChange}
                                        required={true} 
                                        fullWidth={true} 
                                        helperText={this.state.errorsMessages.password}/>

                            <Button href="/forgot-password">
                                Forgot your password?
                            </Button>
                            </CardContent>
                            <CardActions>
                            <Button
                                        color="primary"
                                        variant="contained"
                                        fullWidth={true}
                                        disabled={!this.state.isValidCredentials}
                                        onClick={this.didClickOnLogin}
                                    >
                                        Login
                                </Button>
                            </CardActions>
                            <Grid container={true} direction="column" justify="center" alignItems="center" spacing={40}>
                                    <Grid item={true} xs={12}>
                                    <Typography variant="body2" align="center">
                                                                Don’t have account?
                                                            </Typography>
                                                            <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={this.didClickOnLogin}
                                >
                                    Create New Account
                                </Button>
                                </Grid>

                            </Grid>
            </React.Fragment>
        )
    }
}

// Connect this component to Redux
export default connect((state: any) => state.auth)(ForgotPassword)
