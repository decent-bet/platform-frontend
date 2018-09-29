import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { VIEW_LOGIN, VIEW_DEFAULT } from '../routes'

export default function PublicRoute({ component: Component, ...rest }) {
    let { isLoggedIn } = rest

    const toRender = props => {
        if (isLoggedIn) {
            return (
                <Redirect
                    to={{
                        pathname: VIEW_DEFAULT,
                        state: { from: props.location }
                    }}
                />
            )
        } else {
            const view = props.location.pathname === VIEW_DEFAULT
                    ? VIEW_LOGIN
                    : props.location.pathname
            return <Component view={view} {...props} />
        }
    }

    return <Route {...rest} render={toRender} />
}
