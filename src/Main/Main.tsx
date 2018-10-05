import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MainAppBar from './MainAppBar'
import AppBarToolbar from './AppBarToolbar'
import MainRouter from './MainRouter'
import AppDrawer from './AppDrawer'
import ProviderSelector from './ProviderSelector'
// import NoTokensWarning from './NoTokensWarning'
import * as thunks from './state/thunks'
import './dashboard.css'
import { CircularProgress, Grid } from '@material-ui/core'

class Main extends React.Component<any> {
    public state = {
        currentStage: '',
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

    // private onDrawerButtonPressedListener = open => this.setState({ drawerOpen: open })
    private onDrawerCloseListener = () => this.setState({ drawerOpen: false })

    private onStageChangeListener = value => {
        if (value !== this.state.currentStage) {
            this.props.history.push('/logout')
        }
    }

    private onToggleDrawerListener = () =>
        this.setState({ drawerOpen: !this.state.drawerOpen })

    private onViewChangeListener = newView => {
        if (this.props.location.pathname === newView) return
        this.setState({ drawerOpen: false })
        this.props.history.push(newView)
    }

    public render() {
        const { profile } = this.props

        return (
            <div className="dashboard">
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
                    style={{ marginTop: '80px' }}
                    container={true}
                    direction="row"
                    alignItems="center"
                    justify="center"
                >
                    <Grid item={true} xs={12} sm={10} md={8}>
                        {this.state.loaded ? (
                            <MainRouter profile={profile} />
                        ) : (
                            <CircularProgress />
                        )}
                    </Grid>
                </Grid>
                <AppDrawer
                    isDrawerOpen={this.state.drawerOpen}
                    onDrawerCloseListener={this.onDrawerCloseListener}
                    onViewChangeListener={this.onViewChangeListener}
                    selectedView={this.props.location.pathname}
                    onFaucetClickedListener={this.onFaucetClickedListener}
                >
                    <ProviderSelector
                        onStageChangeListener={this.onStageChangeListener}
                        currentStage={this.state.currentStage}
                    />
                </AppDrawer>
            </div>
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
