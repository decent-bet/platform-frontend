import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './state/actions'
import {
    Button,
    Grid,
    CardActions,
    CardContent,
    Typography,
    CircularProgress
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { VIEW_LOGIN } from '../../routes'
import AuthResult from '../AuthResult'

class ResetPassword extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public componentDidMount = async () => {
        this.props.setDefaultStatus()
        let { id, key } = this.props.match.params
        await this.props.activateAccount(id, key)
    }

    public render() {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />
        return (
            <React.Fragment>
                <CardContent>
                    <Grid
                        container={true}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{ height: '100vh' }}
                    >
                        <Grid item={true} xs={12}>
                            {this.props.processed ? (
                                <AuthResult
                                    message={this.props.resultMessage}
                                />
                            ) : (
                                <React.Fragment>
                                    <Typography
                                        variant="headline"
                                        align="center"
                                        style={{ fontWeight: 'lighter' }}
                                    >
                                        Processing...
                                    </Typography>
                                    <CircularProgress />
                                </React.Fragment>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid
                        container={true}
                        direction="column"
                        alignItems="center"
                        spacing={16}
                    >
                        <Grid item={true} xs={12}>
                            <Button
                                disabled={!this.props.processed}
                                color="secondary"
                                variant="contained"
                                component={loginLink}
                            >
                                Go to Login
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth.resetPassword)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions), dispatch)

const ResetPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword)
export default ResetPasswordContainer
