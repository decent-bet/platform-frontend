import React from 'react'
import DiscoverTabs from './DiscoverTabs'
import DiscoverFavorites from './DiscoverFavorites'
import Offerings from './Offerings'

import './discover.css'

const COVER_IMAGE = `${
    process.env.PUBLIC_URL
}/assets/img/backgrounds/sportsbook-main.png`

export default function Discover() {
    return (
        <div className="discover">
            <div className="container home">
                <div className="row">
                    <div className="col-12 cover">
                        <img src={COVER_IMAGE} alt="Cover" />
                    </div>
                    <DiscoverTabs />
                    <DiscoverFavorites />
                    <Offerings />
                </div>
            </div>
        </div>
    )
}
