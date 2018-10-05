import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { VIEW_LOGIN, VIEW_MAIN, VIEW_CASINO } from '../routes'

export default function PublicRoute({ component: Component, ...rest }) {
    let { userIsAuthenticated } = rest

    const toRender = props => {
        if (userIsAuthenticated) {
            const pathname = props.location.pathname !== VIEW_MAIN ? VIEW_MAIN : VIEW_CASINO
                return <Redirect
                    to={{
                        pathname,
                        state: { from: props.location }
                    }}
                /> 

        } else {
            const view = props.location.pathname !== VIEW_LOGIN
                    ? VIEW_LOGIN
                    : props.location.pathname
            return <Component view={view} {...props} />
        }
    }

    return <Route {...rest} render={toRender} />
}
