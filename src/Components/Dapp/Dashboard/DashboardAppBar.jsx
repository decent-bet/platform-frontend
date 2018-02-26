import React from 'react'
import { AppBar } from 'material-ui'

function DashboardAppBarLogo() {
    return (
        <div className="appbar-title">
            <a href="/">
                <img
                    src={
                        process.env.PUBLIC_URL +
                        '/assets/img/logos/dbet-white.png'
                    }
                    className="logo"
                    alt="Decent.bet"
                />
            </a>
        </div>
    )
}

export default function DashboardAppBar({ children, onToggleDrawerListener }) {
    return (
        <AppBar
            zDepth={4}
            style={{
                position: 'fixed',
                top: 0
            }}
            className="appbar"
            showMenuIconButton={true}
            onLeftIconButtonClick={onToggleDrawerListener}
            title={<DashboardAppBarLogo />}
            iconElementRight={children}
        />
    )
}
