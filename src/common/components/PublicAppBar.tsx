import * as React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import dbetLogo from '../../assets/img/dbet-white.svg'

export default function PublicAppBar(props: { title: string }) {
    return (
        <AppBar className="appbar" position="fixed">
            <Toolbar>
                <Link to="/" className="logo-container">
                    <img src={dbetLogo} className="logo" alt="Decent.bet" />
                </Link>
                <Typography variant="title" align="center">
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
