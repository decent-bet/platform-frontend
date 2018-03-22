import React from 'react'

export default function BetInformation({ game }) {
    return (
        <div className="row mt-4">
            <div className="col-4">
                <p className="text-center key">Bet Amount</p>
                <p className="text-center">{game.betAmount} DBETs</p>
            </div>
            <div className="col-4">
                <p className="text-center key">Bet Count</p>
                <p className="text-center">{game.betCount}</p>
            </div>
            <div className="col-4">
                <p className="text-center key">Your bets</p>
                <p className="text-center">
                    {game.placedBets ? Object.keys(game.placedBets).length : 0}
                </p>
            </div>
        </div>
    )
}
