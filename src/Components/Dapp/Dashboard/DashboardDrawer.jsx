import React, { Component } from 'react'
import { Drawer, MenuItem } from 'material-ui'
import KeyHandler from '../../Base/KeyHandler'
import DashboardDrawerHeader from './DashboardDrawerHeader'

const constants = require('../../Constants')
const keyHandler = new KeyHandler()

export default class DashboardDrawer extends Component {
    render() {
        let {
            isDrawerOpen,
            onRequestChangeListener,
            selectedView,
            onSelectViewListener,
            history
        } = this.props
        return (
            <Drawer
                docked={false}
                width={300}
                open={isDrawerOpen}
                onRequestChange={onRequestChangeListener}
            >
                <DashboardDrawerHeader />
                <div>
                    <MenuItem
                        className={
                            selectedView === constants.VIEW_BALANCES
                                ? 'menu-item selected'
                                : 'menu-item'
                        }
                        onClick={() => {
                            onSelectViewListener(constants.VIEW_BALANCES)
                        }}
                    >
                        <span className="fa fa-money menu-icon" />&ensp;&ensp;BALANCES
                    </MenuItem>
                    <MenuItem
                        className={
                            selectedView === constants.VIEW_CASINO ||
                            selectedView === constants.VIEW_SLOTS ||
                            selectedView === constants.VIEW_SLOTS_GAME
                                ? 'menu-item selected'
                                : 'menu-item'
                        }
                        onClick={() => {
                            onSelectViewListener(constants.VIEW_CASINO)
                        }}
                    >
                        <span className="fa fa-gamepad menu-icon" />&ensp;&ensp;CASINO
                    </MenuItem>
                    <MenuItem
                        className={
                            selectedView === constants.VIEW_PORTAL
                                ? 'menu-item selected'
                                : 'menu-item'
                        }
                        onClick={() => {
                            onSelectViewListener(constants.VIEW_PORTAL)
                        }}
                    >
                        <span className="fa fa-soccer-ball-o menu-icon" />&ensp;&ensp;PORTAL
                    </MenuItem>
                    <MenuItem
                        className={
                            selectedView === constants.VIEW_HOUSE
                                ? 'menu-item selected'
                                : 'menu-item'
                        }
                        onClick={() => {
                            onSelectViewListener(constants.VIEW_HOUSE)
                        }}
                    >
                        <span className="fa fa-home menu-icon" />&ensp;&ensp;HOUSE
                    </MenuItem>
                    <MenuItem
                        className="menu-item"
                        onClick={() => {
                            keyHandler.clear()
                            history.push(constants.VIEW_LOGIN)
                        }}
                    >
                        <span className="fa fa-sign-out menu-icon" />&ensp;&ensp;LOGOUT
                    </MenuItem>

                    {this.props.children}
                </div>
            </Drawer>
        )
    }
}
