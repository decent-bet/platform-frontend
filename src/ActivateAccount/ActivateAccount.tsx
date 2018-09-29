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

class ActivateAccount extends React.Component<any> {
    
    constructor(props) {
        super(props)
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
                                        helperText={this.state.errorsMessages.email}/>

                            <TextField label="Password" 
                                        type="password" 
                                        name="password"
                                        error={this.state.errors.password}
                                        value={this.state.formData.password} 
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
export default connect(state => state)(ActivateAccount)
