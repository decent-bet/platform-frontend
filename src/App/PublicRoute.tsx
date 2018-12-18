import React, { FunctionComponent } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Routes from '../routes'

interface IPublicRouteProps {
    component: any
    path: Routes
    userIsAuthenticated: boolean
}

const PublicRoute: FunctionComponent<IPublicRouteProps> = ({
    component: Component,
    ...rest
}) => {
    let { userIsAuthenticated } = rest

    const toRender = props => {
        if (userIsAuthenticated) {
            const pathname =
                props.location.pathname !== Routes.Main
                    ? Routes.Main
                    : Routes.Casino
            return (
                <Redirect
                    to={{
                        pathname,
                        state: { from: props.location }
                    }}
                />
            )
        } else {
            const view =
                props.location.pathname !== Routes.Login
                    ? Routes.Login
                    : props.location.pathname
            return <Component view={view} {...props} />
        }
    }

    return <Route {...rest} render={toRender} />
}

export default PublicRoute
