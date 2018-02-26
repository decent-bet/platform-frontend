import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Balances from '../Balances/Balances'
import Casino from '../Casino/Casino'
import House from '../House/House'
import Game from '../Casino/Slots/Game'
import Slots from '../Casino/Slots/Slots'
import Portal from '../Portal/Portal'

const constants = require('../../Constants')

const DashboardRouter = () => (
    <Switch>
        <Route exact path={constants.VIEW_CASINO} component={Casino} />
        <Route path={constants.VIEW_HOUSE} component={House} />
        <Route path={constants.VIEW_BALANCES} component={Balances} />
        <Route path={constants.VIEW_PORTAL} component={Portal} />
        <Route path={constants.VIEW_SLOTS} component={Slots} />
        <Route path={constants.VIEW_SLOTS_GAME} component={Game} />
    </Switch>
)

export default DashboardRouter
