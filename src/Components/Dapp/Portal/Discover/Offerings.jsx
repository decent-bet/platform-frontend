import React from 'react'
import OfferingItem from './OfferingItem'

let offerings = [
    {
        imgUrl: 'craps.png',
        name: 'Craps'
    },
    {
        imgUrl: 'sportsbook.png',
        name: 'Sportsbook'
    },
    {
        imgUrl: 'roulette.png',
        name: 'Roulette'
    },
    {
        imgUrl: 'blackjack.png',
        name: 'Blackjack'
    },
    {
        imgUrl: 'slots.png',
        name: 'Slots'
    }
]

export default function Offerings() {
    return (
        <div className="col-12">
            <div className="container mt-3">
                <div className="row">
                    {offerings.map((offering, index) => (
                        <OfferingItem
                            offering={offering}
                            index={index}
                            key={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
