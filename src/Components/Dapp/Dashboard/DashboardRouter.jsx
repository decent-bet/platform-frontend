import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Game from '../Casino/Game'
import Slots from '../Casino/Slots'
import * as constants from '../../Constants'

// Renders the page inside the Dashboard
const DashboardRouter = () => (
    <Switch>
        <Redirect exact from={constants.VIEW_CASINO} to={constants.VIEW_SLOTS} />
        <Route exact path={constants.VIEW_SLOTS} component={Slots} />
        <Route path={constants.VIEW_SLOTS_GAME} component={Game} />
    </Switch>
)

export default DashboardRouter
