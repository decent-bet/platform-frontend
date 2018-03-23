import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Balances from '../Balances'
import House from '../House'
import Game from '../Casino/Game'
import Slots from '../Casino/Slots'
import Portal from '../Portal/Portal'

const constants = require('../../Constants')

// Renders the page inside the Dashboard
const DashboardRouter = () => (
    <Switch>
        <Redirect exact from={constants.VIEW_CASINO} to={constants.VIEW_SLOTS} />
        <Route path={constants.VIEW_HOUSE} component={House} />
        <Route path={constants.VIEW_BALANCES} component={Balances} />
        <Route path={constants.VIEW_PORTAL} component={Portal} />
        <Route path={constants.VIEW_SLOTS} component={Slots} />
        <Route path={constants.VIEW_SLOTS_GAME} component={Game} />
    </Switch>
)

export default DashboardRouter
