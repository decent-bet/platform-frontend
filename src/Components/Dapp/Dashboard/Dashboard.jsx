import React, { Component } from 'react'
import { connect } from 'react-redux'

import DashboardAppBar from './DashboardAppBar'
import DashboardAppBarToolbar from './DashboardAppBarToolbar'
import DashboardRouter from './DashboardRouter'
import DashboardDrawer from './DashboardDrawer'
import ProviderSelector from './ProviderSelector'
import Helper from '../../Helper'
import { Actions, initWatchers } from '../../../Model/balance'

import './dashboard.css'

const helper = new Helper()

class Dashboard extends Component {
    state = {
        provider: helper.getGethProvider(),
        drawerOpen: false
    }

    componentDidMount = () => {
        // Initialize the datastore
        this.props.dispatch(Actions.getPublicAddress())
        this.props.dispatch(Actions.getTokens())
        this.props.dispatch(Actions.getEtherBalance())
        this.props.dispatch(initWatchers)
    }

    // Faucet Button Clicked. Execute Faucet
    onFaucetClickedListener = () => {
        this.props.dispatch(Actions.faucet())
    }

    onDrawerButtonPressedListener = open => this.setState({ drawerOpen: open })

    onProviderChangeListener = (event, index, value) => {
        if (value !== this.state.provider) {
            helper.setGethProvider(value)
            this.setState({ provider: value })
            // Wait for dropdown animation
            setTimeout(() => {
                window.location.reload()
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
                onFaucetClickedListener={this.onFaucetClickedListener}
                tokenBalance={this.props.balance}
                etherBalance={this.props.etherBalance}
            />
        </DashboardAppBar>
    )

    renderDrawer = () => (
        <DashboardDrawer
            isDrawerOpen={this.state.drawerOpen}
            onDrawerStatusChangeListener={this.onDrawerButtonPressedListener}
            onViewChangeListener={this.onViewChangeListener}
            selectedView={this.props.location.pathname}
        >
            <ProviderSelector
                onProviderChangeListener={this.onProviderChangeListener}
                gethNodeProvider={this.state.provider}
            />
        </DashboardDrawer>
    )

    render() {
        return (
            <div className="dashboard">
                {this.renderAppbar()}
                <div className="main">
                    <DashboardRouter />
                </div>
                {this.renderDrawer()}
            </div>
        )
    }
}

// Connect this component to Redux
export default connect(state => state.balance)(Dashboard)
