import React from 'react'
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

function DashboardAppBarLogo() {
    let imageUrl = process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.svg'
    return (
        <Link to="/" className="logo-container">
            <img src={imageUrl} className="logo" alt="Decent.bet" />
        </Link>
    )
}

export default function DashboardAppBar({ children, onToggleDrawerListener }) {
    return (
        <AppBar className="appbar" position="fixed" color="primary">
            <Toolbar>
                <IconButton
                    aria-label="Menu"
                    onClick={onToggleDrawerListener}
                >
                    <FontAwesomeIcon icon="bars" />
                </IconButton>
                <DashboardAppBarLogo />
                {children}
            </Toolbar>
        </AppBar>
    )
}
