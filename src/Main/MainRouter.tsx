import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Casino from '../Casino'
import Account from '../Account'
import AccountNotActivated from '../Account/AccountNotActivated'
import {
    VIEW_CASINO,
    VIEW_ACCOUNT,
    VIEW_MAIN,
    VIEW_ACCOUNT_NOTACTIVATED
} from '../routes'

const MainRouter = () => {
    return (
        <Switch>
            <Redirect exact={true} from={VIEW_MAIN} to={VIEW_CASINO} />
            <Route path={VIEW_CASINO} component={Casino} />
            <Route
                path={VIEW_ACCOUNT_NOTACTIVATED}
                component={AccountNotActivated}
            />
            <Route path={VIEW_ACCOUNT} component={Account} />
            <Redirect exact={true} from="*" to={VIEW_MAIN} />
        </Switch>
    )
}

export default MainRouter
