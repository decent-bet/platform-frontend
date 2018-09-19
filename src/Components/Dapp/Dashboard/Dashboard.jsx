import React, { Component } from 'react'
import { connect } from 'react-redux'
import DashboardAppBar from './DashboardAppBar'
import DashboardAppBarToolbar from './DashboardAppBarToolbar'
import DashboardRouter from './DashboardRouter'
import DashboardDrawer from './DashboardDrawer'
import ProviderSelector from './ProviderSelector'
import NoTokensWarning from './NoTokensWarning'
import { Thunks } from '../../../Model/balance'
import { Thunks as AuthThunks } from '../../../Model/auth'
import './dashboard.css'

class Dashboard extends Component {

    state = {
        provider: '',
        drawerOpen: false
    }

    componentDidMount = async () => {
        // Initialize the datastore
        this.props.dispatch(Thunks.initialize())
    }

    // Faucet Button Clicked. Execute Faucet
    onFaucetClickedListener = () => {
        this.onToggleDrawerListener()
        this.props.dispatch(Thunks.faucet())
    }

    onDrawerButtonPressedListener = open => this.setState({ drawerOpen: open })
    onDrawerCloseListener = () => this.setState({ drawerOpen: false })

    onProviderChangeListener = value => {
        if (value !== this.state.currentStage) {
            this.setState({ provider: value })
            this.props.dispatch(AuthThunks.setCurrentStage(value))
            this.props.dispatch(AuthThunks.logout())
            // Wait for dropdown animation
            setTimeout(() => {
                this.props.history.push('/login')
            }, 500)
        }
    }

    onToggleDrawerListener = () =>
        this.setState({ drawerOpen: !this.state.drawerOpen })

    onViewChangeListener = newView => {
        if (this.props.location.pathname === newView) return
        this.setState({ drawerOpen: false })
        this.props.history.push(newView)
    }

    renderAppbar = () => (
        <DashboardAppBar onToggleDrawerListener={this.onToggleDrawerListener}>
            <DashboardAppBarToolbar
                address={this.props.address}
                tokenBalance={this.props.balance}
                etherBalance={this.props.etherBalance}
            />
        </DashboardAppBar>
    )

    renderDrawer = () => (
        <DashboardDrawer
            isDrawerOpen={this.state.drawerOpen}
            onDrawerCloseListener={this.onDrawerCloseListener}
            onViewChangeListener={this.onViewChangeListener}
            selectedView={this.props.location.pathname}
            onFaucetClickedListener={this.onFaucetClickedListener}
        >
            <ProviderSelector
                onProviderChangeListener={this.onProviderChangeListener}
                gethNodeProvider={this.state.provider}
            />
        </DashboardDrawer>
    )

    render() {
        // Print the rest of the content only if the user has DBETs
        const inner = this.props.balance > 0 ? <DashboardRouter /> : <NoTokensWarning />
        return (<div className="dashboard">
                {this.renderAppbar()}
                {inner}
                {this.renderDrawer()}
            </div>
          )
    }
}



// Connect this component to Redux
export default connect(state => state.balance)(Dashboard)
