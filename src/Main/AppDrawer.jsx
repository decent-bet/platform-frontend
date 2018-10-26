import React from 'react'
import { Drawer, Divider, List } from '@material-ui/core'
import AppDrawerItem from './AppDrawerItem'
import FaucetMenuItem from './FaucetMenuItem'
import {
    VIEW_CASINO,
    VIEW_SLOTS,
    VIEW_SLOTS_GAME,
    VIEW_LOGOUT,
    VIEW_ACCOUNT,
    VIEW_ACCOUNT_NOTACTIVATED
} from '../routes'
import { CURRENT_ENV, ENV_PRODUCTION } from '../constants'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset'
import dbetLogo from '../assets/img/dbet-white.svg'

export default function AppDrawer({
    isDrawerOpen,
    onDrawerCloseListener,
    onViewChangeListener,
    selectedView,
    onFaucetClickedListener
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
                        isSelected={selectedView.startsWith(VIEW_CASINO)}
                        onViewChangeListener={onViewChangeListener}
                        title="Casino"
                        icon={<VideogameAssetIcon />}
                    />

                    <AppDrawerItem
                        viewToSelect={VIEW_ACCOUNT}
                        isSelected={
                            selectedView === VIEW_ACCOUNT ||
                            selectedView === VIEW_ACCOUNT_NOTACTIVATED
                        }
                        onViewChangeListener={onViewChangeListener}
                        title="Account"
                        icon={<AccountCircleIcon />}
                    />
                    {CURRENT_ENV !== ENV_PRODUCTION ? (
                        <FaucetMenuItem
                            onFaucetClickedListener={onFaucetClickedListener}
                        />
                    ) : null}

                    <AppDrawerItem
                        viewToSelect={VIEW_LOGOUT}
                        isSelected={false}
                        onViewChangeListener={onViewChangeListener}
                        title="Logout"
                        icon={<ExitToAppIcon />}
                    />

                    <Divider />
                </List>
            </div>
        </Drawer>
    )
}
