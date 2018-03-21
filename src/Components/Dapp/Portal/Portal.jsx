import React from 'react'
import Discover from './Pages/Discover/Discover'
import SportsBook from './Pages/Sportsbook/Sportsbook'
import PortalNavbar from './PortalNavbar'
import { Route, Redirect, Switch } from 'react-router'

import './portal.css'

const constants = require('../../Constants')

export default function Portal(props) {
    let { match } = props // This is injected by React-Router
    let discoverPageUrl = `${match.url}/${constants.PORTAL_PAGE_DISCOVER}`
    let sportsbookPageUrl = `${match.url}/${constants.PORTAL_PAGE_SPORTSBOOK}`
    return (
        <main className="portal">
            <PortalNavbar matchUrl={match.url} />
            <Switch>
                <Route path={discoverPageUrl} component={Discover} />
                <Route path={sportsbookPageUrl} component={SportsBook} />
                {/*FALLBACK ROUTE */}
                <Redirect to={discoverPageUrl} />
            </Switch>
        </main>
    )
}
