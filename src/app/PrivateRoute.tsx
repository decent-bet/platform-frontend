import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { VIEW_LOGIN } from '../routes'

export default function PrivateRoute({ component: Component, ...rest }) {
    let { userIsAuthenticated } = rest
    
    const toRender = props => {
        if (userIsAuthenticated) {
            return <Component view={props.location.pathname} {...props} />
        } else {
            return (
                // Redirect to login screen
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
