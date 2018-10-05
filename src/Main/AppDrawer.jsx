import React from 'react'
import { Drawer, Divider, List } from '@material-ui/core'
import AppDrawerItem from './AppDrawerItem'
import FaucetMenuItem from './FaucetMenuItem'
import {
    VIEW_CASINO,
    VIEW_SLOTS,
    VIEW_SLOTS_GAME,
    VIEW_LOGOUT,
    VIEW_PROFILE
} from '../routes'
import dbetLogo from '../assets/img/dbet-white.svg'

export default function AppDrawer({
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
                    <AppDrawerItem
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

                    <AppDrawerItem
                        viewToSelect={VIEW_PROFILE}
                        isSelected={
                            selectedView === VIEW_PROFILE
                        }
                        onViewChangeListener={onViewChangeListener}
                        title="Profile"
                        iconClass="user-check"
                    />

                    <FaucetMenuItem
                        onFaucetClickedListener={onFaucetClickedListener}
                    />

                    <AppDrawerItem
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
