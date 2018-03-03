import React from 'react'
import { AppBar } from 'material-ui'
import { Link } from 'react-router-dom'

function DashboardAppBarLogo() {
    let imageUrl = process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.svg'
    return (
        <Link to="/">
            <img src={imageUrl} className="logo" alt="Decent.bet" />
        </Link>
    )
}

export default function DashboardAppBar({ children, onToggleDrawerListener }) {
    return (
        <AppBar
            zDepth={4}
            className="appbar"
            showMenuIconButton={true}
            onLeftIconButtonClick={onToggleDrawerListener}
            title={<DashboardAppBarLogo />}
            iconElementRight={children}
        />
    )
}
