import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import MainAppBar from './MainAppBar'
import AppBarToolbar from './AppBarToolbar'
import MainRouter from './MainRouter'
import AppDrawer from './AppDrawer'
import * as thunks from './state/thunks'
import './main.css'
import { Grid, Fade } from '@material-ui/core'
import AppLoading from '../common/components/AppLoading'
import { VIEW_ACCOUNT, VIEW_ACCOUNT_NOTACTIVATED } from '../routes'

class Main extends React.Component<any> {
    public state = {
        drawerOpen: false,
        loaded: false
    }

    public async componentDidMount() {
        await this.props.initializeMain()
        this.setState({ loaded: true })
    }

    // Faucet Button Clicked. Execute Faucet
    private onFaucetClickedListener = async () => {
        this.onToggleDrawerListener()
        await this.props.faucet()
    }

    private onDrawerCloseListener = () => this.setState({ drawerOpen: false })

    private onToggleDrawerListener = () =>
        this.setState({ drawerOpen: !this.state.drawerOpen })

    private onViewChangeListener = newView => {
        if (this.props.location.pathname === newView) return
        this.setState({ drawerOpen: false })
        this.props.history.push(newView)
    }

    public render() {
        if (!this.state.loaded) {
            return <AppLoading />
        }

        const {
            accountIsActivated,
            accountIsVerified,
            accountHasAddress
        } = this.props

        if (!accountIsActivated) {
            if (this.props.location.pathname !== VIEW_ACCOUNT_NOTACTIVATED) {
                return <Redirect to={VIEW_ACCOUNT_NOTACTIVATED} />
            }
        } else if (!accountIsVerified || !accountHasAddress) {
            if (this.props.location.pathname !== VIEW_ACCOUNT) {
                return <Redirect to={VIEW_ACCOUNT} />
            }
        }

        return (
            <Fade in={this.state.loaded} timeout={500}>
                <React.Fragment>
                    <MainAppBar
                        onToggleDrawerListener={this.onToggleDrawerListener}
                    >
                        <AppBarToolbar
                            address={this.props.address}
                            tokenBalance={this.props.balance}
                            etherBalance={this.props.etherBalance}
                        />
                    </MainAppBar>
                    <Grid
                        style={{ marginTop: '80px', marginBottom: '80px' }}
                        container={true}
                        direction="row"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item={true} xs={12}>
                            <MainRouter />
                        </Grid>
                    </Grid>
                    <AppDrawer
                        isDrawerOpen={this.state.drawerOpen}
                        onDrawerCloseListener={this.onDrawerCloseListener}
                        onViewChangeListener={this.onViewChangeListener}
                        selectedView={this.props.location.pathname}
                        onFaucetClickedListener={this.onFaucetClickedListener}
                    />
                </React.Fragment>
            </Fade>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const MainContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)
export default MainContainer
