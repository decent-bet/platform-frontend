import React from 'react'
import GameList from './GameList'

import './casino.css'

// Main "Casino" Page
export default function Casino() {
    let logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.svg`
    return (
        <div className="casino">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top">
                            <img
                                src={logoUrl}
                                className="logo"
                                alt="Decent.Bet Logo"
                            />
                            <h3 className="text-center mt-3">CASINO</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col" style={{ marginTop: 30 }}>
                        <div className="intro">
                            <h5 className="text-center text-uppercase">
                                Choose from a variety of Casino games available
                                on the{' '}
                                <span className="text-gold">Decent.bet </span>
                                platform
                            </h5>
                        </div>
                    </div>
                </div>

                <GameList />
            </div>
        </div>
    )
}
