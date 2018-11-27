import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Game from './Game'
import Slots from './Slots'
import { VIEW_CASINO, VIEW_SLOTS, VIEW_SLOTS_GAME } from '../routes'

const CasinoRouter = () => {
    return (
        <Switch>
            <Redirect exact={true} from={VIEW_CASINO} to={VIEW_SLOTS} />
            <Route path={VIEW_SLOTS_GAME} component={Game} />
            <Route path={VIEW_SLOTS} component={Slots} />
        </Switch>
    )
}

export default CasinoRouter
