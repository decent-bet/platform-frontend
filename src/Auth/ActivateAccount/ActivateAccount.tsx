import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../state/actions'
import { Link } from 'react-router-dom'
import {
    Button,
    Grid,
    CardActions,
    CardContent,
    CircularProgress
} from '@material-ui/core'
import { VIEW_LOGIN } from '../../routes'
import AuthResult from '../AuthResult'

class ActivateAccount extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public componentDidMount = async () => {
        this.props.setDefaultStatus()
        let { id, key } = this.props.match.params
        await this.props.activateAccount(id, key)
    }

    private renderLoading = () => {
        return (
            <Grid
                container={true}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ height: '100vh' }}
            >
                <Grid container={true} direction="column" alignItems="center">
                    <Grid item={true} xs={12}>
                        <CircularProgress />
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    private renderResult = () => {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />

        return (
            <React.Fragment>
                <CardContent>
                    <Grid
                        container={true}
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item={true} xs={12}>
                            <AuthResult message={this.props.resultMessage} />
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

    public render() {
        return this.props.processed ? this.renderResult() : this.renderLoading()
    }
}

const mapStateToProps = state => Object.assign({}, state.auth)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

const ActivateAccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivateAccount)
export default ActivateAccountContainer
