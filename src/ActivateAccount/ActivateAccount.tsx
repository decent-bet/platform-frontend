import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './state/actions'
import { Link } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { VIEW_LOGIN } from '../routes'
import PublicRouteContainer from '../common/components/PublicRouteContainer'
import AppLoading from 'src/common/components/AppLoading'

class ActivateAccount extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public componentDidMount = async () => {
        let { id, key } = this.props.match.params
        await this.props.activate(id, key)
    }

    private renderResult = () => {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />

        return (
            <PublicRouteContainer>
                <Grid
                    container={true}
                    direction="column"
                    alignItems="center"
                    spacing={40}
                >
                    <Grid item={true} xs={12}>
                        <Typography variant="headline" align="center">
                            {this.props.resultMessage}
                        </Typography>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Button
                            color="secondary"
                            variant="contained"
                            component={loginLink}
                        >
                            Go to Login
                        </Button>
                    </Grid>
                </Grid>
            </PublicRouteContainer>
        )
    }

    public render() {
        return this.props.loading ? (
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
