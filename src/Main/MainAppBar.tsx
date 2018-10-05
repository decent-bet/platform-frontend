import * as React from 'react'
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import dbetLogo from '../assets/img/dbet-white.svg'

export default function MainAppBar({ children, onToggleDrawerListener }) {
    return (
        <AppBar className="appbar" position="fixed" color="primary">
            <Toolbar>
                <IconButton aria-label="Menu" onClick={onToggleDrawerListener}>
                    <MenuIcon/>
                </IconButton>
                <Link to="/" className="logo-container">
                    <img src={dbetLogo} className="logo" alt="Decent.bet" />
                </Link>
                {children}
            </Toolbar>
        </AppBar>
    )
}
