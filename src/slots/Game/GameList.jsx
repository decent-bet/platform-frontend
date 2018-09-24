import React from 'react'
import GameCard from './GameCard'

export default function GameList() {
    return (
        <div className="row">
            <div className="col" style={{ marginTop: 60, marginBottom: 60 }}>
                <div className="games">
                    <div className="row">
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
                </div>
            </div>
        </div>
    )
}
