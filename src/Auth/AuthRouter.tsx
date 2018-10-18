import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import ForgotPassword from './ForgotPassword'
import SignUp from './SignUp'
import Login from './Login'
import ResetPassword from './ResetPassword'
import {
    VIEW_AUTH,
    VIEW_LOGIN,
    VIEW_FORGOT_PASSWORD,
    VIEW_SIGNUP,
    VIEW_RESET_PASSWROD
} from '../routes'

const AuthRouter = () => {
    return (
        <Switch>
            <Redirect exact={true} from={VIEW_AUTH} to={VIEW_LOGIN} />
            <Route path={VIEW_LOGIN} component={Login} />
            <Route path={VIEW_SIGNUP} component={SignUp} />
            <Route path={VIEW_RESET_PASSWROD} component={ResetPassword} />
            <Route path={VIEW_FORGOT_PASSWORD} component={ForgotPassword} />
        </Switch>
    )
}

export default AuthRouter
