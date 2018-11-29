import React, { FunctionComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Casino from '../Casino'
import Account from '../Account'
import AccountNotActivated from '../Account/AccountNotActivated'
import House from '../House'
import Routes from '../routes'

const MainRouter: FunctionComponent<{}> = () => {
    return (
        <Switch>
            <Redirect exact={true} from={Routes.Main} to={Routes.Casino} />
            <Route path={Routes.House} component={House} />
            <Route path={Routes.Casino} component={Casino} />
            <Route
                path={Routes.AccountNotActivated}
                component={AccountNotActivated}
            />
            <Route path={Routes.Account} component={Account} />
            <Redirect exact={true} from="*" to={Routes.Main} />
        </Switch>
    )
}

export default MainRouter
