import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import ForgotPassword from './ForgotPassword'
import SignUp from './SignUp'
import Login from './Login'
import { VIEW_LOGIN, VIEW_FORGOT_PASSWORD, VIEW_SIGNUP } from '../routes'

// Renders the page inside the Dashboard
const AuthRouter = () => (
    <Switch>
        <Route exact={true} path={VIEW_LOGIN} component={Login} />
        <Route path={VIEW_SIGNUP} component={SignUp} />
        <Route path={VIEW_FORGOT_PASSWORD} component={ForgotPassword} />
    </Switch>
)

export default AuthRouter
