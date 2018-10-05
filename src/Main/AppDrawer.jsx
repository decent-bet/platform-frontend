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
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset'
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
                        icon={<VideogameAssetIcon/>} 
                    />

                    <AppDrawerItem
                        viewToSelect={VIEW_PROFILE}
                        isSelected={
                            selectedView === VIEW_PROFILE
                        }
                        onViewChangeListener={onViewChangeListener}
                        title="Profile"
                        icon={<AccountCircleIcon/>}   
                    />

                    <FaucetMenuItem
                        onFaucetClickedListener={onFaucetClickedListener}
                    />

                    <AppDrawerItem
                        viewToSelect={VIEW_LOGOUT}
                        isSelected={false}
                        onViewChangeListener={onViewChangeListener}
                        title="Logout"
                        icon={<ExitToAppIcon/>}
                    />

                    <Divider />

                    {children}
                </List>
            </div>
        </Drawer>
    )
}
