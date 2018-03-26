import React from 'react'
import { NavLink } from 'react-router-dom'

export default function PortalNavlink(props) {
    let { page, text, ...rest } = props
    return (
        <li className="nav-item clickable">
            <NavLink
                className="nav-link clickable"
                activeClassName="active"
                to={page}
                {...rest}
            >
                {text}
            </NavLink>
        </li>
    )
}
