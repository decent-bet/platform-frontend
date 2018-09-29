import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { VIEW_LOGIN, VIEW_DEFAULT } from '../routes'

export default function PrivateRoute({ component: Component, ...rest }) {
    let { isLoggedIn } = rest
    
    const toRender = props => {
        if (isLoggedIn) {
            const view =
                props.location.pathname === VIEW_DEFAULT
                    ? VIEW_DEFAULT
                    : props.location.pathname
            return <Component view={view} {...props} />
        } else {
            // Redirect to login screen
            return (
                <Redirect
                    to={{
                        pathname: VIEW_LOGIN,
                        state: { from: props.location }
                    }}
                />
            )
        }
    }

    return <Route {...rest} render={toRender} />
}
