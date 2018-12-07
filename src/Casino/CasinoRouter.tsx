import React, { FunctionComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Game from './Game'
import Slots from './Slots'
import Routes from '../routes'

const CasinoRouter: FunctionComponent<{}> = () => {
    return (
        <Switch>
            <Redirect exact={true} from={Routes.Casino} to={Routes.Slots} />
            <Route path={Routes.SlotsGame} component={Game} />
            <Route path={Routes.Slots} component={Slots} />
        </Switch>
    )
}

export default CasinoRouter
