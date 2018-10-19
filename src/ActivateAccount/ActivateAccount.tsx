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
        await this.props.activateAccount(id, key)
    }

    private renderResult = () => {
        const loginLink = props => <Link to={VIEW_LOGIN} {...props} />

        return (
            <PublicRouteContainer>
                <Grid
                    container={true}
                    direction="row"
                    alignItems="center"
                    spacing={16}
                >
                    <Grid item={true} xs={12}>
                        <Typography>{this.props.resultMessage}</Typography>
                    </Grid>
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
            </PublicRouteContainer>
        )
    }

    public render() {
        return this.props.processed ? (
            this.renderResult()
        ) : (
            <AppLoading message="Processing the account activation..." />
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth.activateAccount)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.activateAccount), dispatch)

const ActivateAccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivateAccount)
export default ActivateAccountContainer
