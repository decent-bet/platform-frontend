import React, { Component } from 'react'
import { Drawer } from 'material-ui'
import DashboardDrawerHeader from './DashboardDrawerHeader'
import DashboardDrawerItem from './DashboardDrawerItem'

const constants = require('../../Constants')

export default class DashboardDrawer extends Component {
    render() {
        let {
            isDrawerOpen,
            onDrawerStatusChangeListener,
            onViewChangeListener,
            selectedView,
            onLogoutListener
        } = this.props
        return (
            <Drawer
                docked={false}
                width={300}
                open={isDrawerOpen}
                onRequestChange={onDrawerStatusChangeListener}
            >
                <DashboardDrawerHeader />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_BALANCES}
                    isSelected={selectedView === constants.VIEW_BALANCES}
                    onViewChangeListener={onViewChangeListener}
                    title="Balances"
                    iconClass="money-bill-alt"
                />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_CASINO}
                    isSelected={
                        selectedView === constants.VIEW_CASINO ||
                        selectedView === constants.VIEW_SLOTS ||
                        selectedView === constants.VIEW_SLOTS_GAME
                    }
                    onViewChangeListener={onViewChangeListener}
                    title="Casino"
                    iconClass="gamepad"
                />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_PORTAL}
                    isSelected={selectedView === constants.VIEW_PORTAL}
                    onViewChangeListener={onViewChangeListener}
                    title="Portal"
                    iconClass="futbol"
                />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_HOUSE}
                    isSelected={selectedView === constants.VIEW_HOUSE}
                    onViewChangeListener={onViewChangeListener}
                    title="House"
                    iconClass="home"
                />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_LOGIN}
                    isSelected={false}
                    onViewChangeListener={onViewChangeListener}
                    title="Logout"
                    iconClass="sign-out-alt"
                    onClick={onLogoutListener}
                />

                {this.props.children}
            </Drawer>
        )
    }
}
