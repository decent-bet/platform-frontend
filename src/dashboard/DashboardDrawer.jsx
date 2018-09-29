import React from 'react'
import { Drawer, Divider, List } from '@material-ui/core'
import DashboardDrawerItem from './DashboardDrawerItem'
import FaucetMenuItem from './FaucetMenuItem'
import {
    VIEW_CASINO,
    VIEW_SLOTS,
    VIEW_SLOTS_GAME,
    VIEW_LOGOUT
} from '../routes'
import dbetLogo from '../assets/img/dbet-white.svg'

export default function DashboardDrawer({
    isDrawerOpen,
    onDrawerCloseListener,
    onViewChangeListener,
    selectedView,
    onFaucetClickedListener,
    children
}) {
    
    return (
        <Drawer
            className="drawer"
            open={isDrawerOpen}
            onClose={onDrawerCloseListener}
        >
            <div className="drawerInner">
                <img className="logo" src={dbetLogo} alt="Decent Bet Logo" />
                <List component="nav">
                    <DashboardDrawerItem
                        viewToSelect={VIEW_CASINO}
                        isSelected={
                            selectedView === VIEW_CASINO ||
                            selectedView === VIEW_SLOTS ||
                            selectedView === VIEW_SLOTS_GAME
                        }
                        onViewChangeListener={onViewChangeListener}
                        title="Casino"
                        iconClass="gamepad"
                    />

                    <FaucetMenuItem
                        onFaucetClickedListener={onFaucetClickedListener}
                    />

                    <DashboardDrawerItem
                        viewToSelect={VIEW_LOGOUT}
                        isSelected={false}
                        onViewChangeListener={onViewChangeListener}
                        title="Logout"
                        iconClass="sign-out-alt"
                    />

                    <Divider />

                    {children}
                </List>
            </div>
        </Drawer>
    )
}
