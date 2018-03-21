import React from 'react'
import PortalNavlink from './PortalNavlink'

const constants = require('../../Constants')

export default function PortalNavbar({ matchUrl }) {
    let discoverPageUrl = `${matchUrl}/${constants.PORTAL_PAGE_DISCOVER}`
    let sportsbookPageUrl = `${matchUrl}/${constants.PORTAL_PAGE_SPORTSBOOK}`
    return (
        <nav className="navbar navbar-toggleable-md">
            <button
                className="navbar-toggler navbar-toggler-right"
                type="button"
                data-toggle="collapse"
                data-target="#navbar-toggler"
                aria-controls="navbar-toggler"
                aria-expanded="false"
            >
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto mt-2 mt-md-0">
                    <div className="container">
                        <div className="row">
                            <PortalNavlink
                                page={discoverPageUrl}
                                text="Discover"
                            />
                            <PortalNavlink
                                page={sportsbookPageUrl}
                                text="Sportsbook"
                            />
                        </div>
                    </div>
                </ul>
            </div>
        </nav>
    )
}
