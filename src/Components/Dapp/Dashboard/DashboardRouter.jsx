import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Game from '../Casino/Game'
import Slots from '../Casino/Slots'
import { VIEW_CASINO, VIEW_SLOTS, VIEW_SLOTS_GAME } from '../../Constants'

// Renders the page inside the Dashboard
const DashboardRouter = () => (
    <Switch>
        <Redirect exact from={VIEW_CASINO} to={VIEW_SLOTS} />
        <Route exact path={VIEW_SLOTS} component={Slots} />
        <Route path={VIEW_SLOTS_GAME} component={Game} />
    </Switch>
)

export default DashboardRouter
