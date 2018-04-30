import React from 'react'
import { Drawer, Divider } from 'material-ui'
import DashboardDrawerItem from './DashboardDrawerItem'
import FaucetMenuItem from './FaucetMenuItem'
import * as constants from '../../Constants'

export default function DashboardDrawer({
    isDrawerOpen,
    onDrawerStatusChangeListener,
    onViewChangeListener,
    selectedView,
    onFaucetClickedListener,
    children
}) {
    let imgSrc = process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.svg'
    return (
        <Drawer
            className="drawer"
            docked={false}
            width={300}
            open={isDrawerOpen}
            onRequestChange={onDrawerStatusChangeListener}
        >
            <img className="logo" alt="DBET Logo" src={imgSrc} />

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

            <FaucetMenuItem onFaucetClickedListener={onFaucetClickedListener} />

            <DashboardDrawerItem
                viewToSelect={constants.VIEW_LOGIN}
                isSelected={false}
                onViewChangeListener={onViewChangeListener}
                title="Logout"
                iconClass="sign-out-alt"
            />

            <Divider />

            {children}
        </Drawer>
    )
}
