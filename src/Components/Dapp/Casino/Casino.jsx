import React from 'react'
import GameCard from './GameCard'

import './casino.css'

// Main "Casino" Page
export default function Casino() {
    let logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.svg`
    return (
        <main className="casino">
            <div className="container">
                <section className="logo-container">
                    <img src={logoUrl} className="logo" alt="Decent.Bet Logo" />
                    <h3 className="text-center mt-3">CASINO</h3>
                </section>

                <section className="description">
                    <h5 className="text-center">
                        Choose from a variety of casino games available on the{' '}
                        <span className="text-gold">Decent.bet</span> platform
                    </h5>
                </section>

                <GameCard
                    title="Slots"
                    imgUrl="backgrounds/slots.jpg"
                    url="/slots"
                    available={true}
                />
                <GameCard
                    title="Craps"
                    imgUrl="backgrounds/craps.jpg"
                />
                <GameCard
                    title="Roulette"
                    imgUrl="backgrounds/roulette.jpg"
                />
                <GameCard
                    title="Crypto price betting"
                    imgUrl="backgrounds/crypto-price-betting.jpg"
                />
            </div>
        </main>
    )
}
