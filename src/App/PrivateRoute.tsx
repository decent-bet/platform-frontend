import React, { FunctionComponent } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Routes from '../routes'

interface IPrivateRouteProps {
    component: any
    userIsAuthenticated: boolean
    path: Routes
}

const PrivateRoute: FunctionComponent<IPrivateRouteProps> = ({
    component: Component,
    ...rest
}) => {
    let { userIsAuthenticated } = rest

    const toRender = props => {
        if (userIsAuthenticated) {
            return <Component view={props.location.pathname} {...props} />
        } else {
            return (
                // Redirect to login screen
                <Redirect
                    to={{
                        pathname: Routes.Login,
                        state: { from: props.location }
                    }}
                />
            )
        }
    }

    return <Route {...rest} render={toRender} />
}

export default PrivateRoute
