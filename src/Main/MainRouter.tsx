import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Game from '../Game'
import Slots from '../Slots'
import Account from '../Account'
import AccountNotActivated from '../Account/AccountNotActivated'
import {
    VIEW_SLOTS,
    VIEW_SLOTS_GAME,
    VIEW_ACCOUNT,
    VIEW_MAIN,
    VIEW_ACCOUNT_NOTACTIVATED
} from '../routes'

const MainRouter = () => {
    return (
        <Switch>
            <Redirect exact={true} from={VIEW_MAIN} to={VIEW_SLOTS} />
            <Route path={VIEW_SLOTS} component={Slots} />
            <Route path={VIEW_SLOTS_GAME} component={Game} />
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
