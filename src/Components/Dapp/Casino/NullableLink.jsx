import React from 'react'
import { Link } from 'react-router-dom'

// Wraps a <Link>, and renders an empty <a> if the `to` parameter is null
export default function NullableLink({ to, children, ...rest }) {
    if (to) {
        return (
            <Link to={to} {...rest}>
                {children}
            </Link>
        )
    } else {
        return <a {...rest}>{children}</a>
    }
}
