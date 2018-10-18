import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Button,
    Grid,
    CardActions,
    CardContent,
    Typography
} from '@material-ui/core'
import { VIEW_LOGIN } from '../../routes'
import { Link } from 'react-router-dom'
import SignUpForm from './SignUpForm'
import AuthResult from '../AuthResult'
import actions from '../state/actions'

class SignUp extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public componentDidMount() {
        this.props.setDefaultStatus()
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
                        Create New Account
                    </Typography>
                    {this.props.processed ? (
                        <AuthResult message={this.props.resultMessage} />
                    ) : (
                        <SignUpForm />
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
                </CardActions>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

const SignUpContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp)
export default SignUpContainer
