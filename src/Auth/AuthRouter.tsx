import React, { FunctionComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import ForgotPassword from './ForgotPassword'
import SignUp from './SignUp'
import Login from './Login'
import ResetPassword from './ResetPassword'
import Routes from '../routes'

const AuthRouter: FunctionComponent<{}> = () => {
    return (
        <Switch>
            <Redirect exact={true} from={Routes.Auth} to={Routes.Login} />
            <Route path={Routes.Login} component={Login} />
            <Route path={Routes.Login} component={SignUp} />
            <Route path={Routes.ResetPassword} component={ResetPassword} />
            <Route path={Routes.ForgotPassword} component={ForgotPassword} />
        </Switch>
    )
}

export default AuthRouter
