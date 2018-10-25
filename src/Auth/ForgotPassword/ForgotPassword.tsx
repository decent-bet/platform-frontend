import * as React from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Grid,
    CardActions,
    CardContent,
    Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { VIEW_LOGIN } from '../../routes'
import AuthResult from '../AuthResult'
import ForgotPasswordForm from './ForgotPasswordForm'

class ForgotPassword extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public render() {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />

        return (
            <React.Fragment>
                <CardContent>
                    <Typography
                        variant="headline"
                        align="center"
                        style={{ fontWeight: 'lighter' }}
                    >
                        Forgot your password ?
                    </Typography>
                    {this.props.processed ? (
                        <AuthResult message={this.props.resultMessage} />
                    ) : (
                        <ForgotPasswordForm />
                    )}
                </CardContent>
                <CardActions>
                    <Grid
                        container={true}
                        direction="column"
                        alignItems="center"
                        spacing={16}
                    >
                        <Grid item={true} xs={12}>
                            <Typography variant="body2">
                                Want to login?
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
                </CardActions>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth.forgotPassword)

const ForgotPasswordContainer = connect(mapStateToProps)(ForgotPassword)
export default ForgotPasswordContainer
