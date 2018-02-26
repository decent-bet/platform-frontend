import React, { Component } from 'react'
import { Drawer } from 'material-ui'
import DashboardDrawerHeader from './DashboardDrawerHeader'
import DashboardDrawerItem from './DashboardDrawerItem'

const constants = require('../../Constants')

export default class DashboardDrawer extends Component {
    render() {
        let { isDrawerOpen, onRequestChangeListener, selectedView } = this.props
        return (
            <Drawer
                docked={false}
                width={300}
                open={isDrawerOpen}
                onRequestChange={onRequestChangeListener}
            >
                <DashboardDrawerHeader />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_BALANCES}
                    isSelected={selectedView === constants.VIEW_BALANCES}
                    title="Balances"
                    iconClass="money"
                />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_CASINO}
                    isSelected={
                        selectedView === constants.VIEW_CASINO ||
                        selectedView === constants.VIEW_SLOTS ||
                        selectedView === constants.VIEW_SLOTS_GAME
                    }
                    title="Casino"
                    iconClass="gamepad"
                />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_PORTAL}
                    isSelected={selectedView === constants.VIEW_PORTAL}
                    title="Portal"
                    iconClass="soccer-ball-o"
                />

                <DashboardDrawerItem
                    viewToSelect={constants.VIEW_HOUSE}
                    isSelected={selectedView === constants.VIEW_HOUSE}
                    title="House"
                    iconClass="home"
                />

                {this.props.children}
            </Drawer>
        )
    }
}
