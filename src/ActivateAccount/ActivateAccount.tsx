import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './state/actions'
import { Link } from 'react-router-dom'
import {
    Button,
    Grid,
    Typography,
    CardActions,
    CardContent
} from '@material-ui/core'
import { VIEW_LOGIN } from '../routes'
import PublicRouteContainer from '../common/components/PublicRouteContainer'
import AppLoading from 'src/common/components/AppLoading'
import AuthResult from '../Auth/AuthResult'

class ActivateAccount extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = { processed: false }
    }

    public componentDidMount = async () => {
        let { id, key } = this.props.match.params
        await this.props.activate(id, key)
        this.setState({ processed: true })
    }

    public componentWillUnmount() {
        this.setState({ processed: false })
    }

    private renderResult = () => {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />

        return (
            <PublicRouteContainer>
                <CardContent>
                    <AuthResult message={this.props.resultMessage} />
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
                                Go to the login
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
            </PublicRouteContainer>
        )
    }

    public render() {
        return this.props.loading && this.state.processed ? (
            <AppLoading message="Processing the account activation..." />
        ) : (
            this.renderResult()
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.activate)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.activateAccount), dispatch)

const ActivateAccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivateAccount)
export default ActivateAccountContainer
