import React from 'react'

function isGameBettingPeriodOver(game, bettingProviderTime) {
    return bettingProviderTime != null && game.cutOffTime < bettingProviderTime
}

export default function BettingStatus({ game, gameProviderTime }) {
    if (isGameBettingPeriodOver(game)) {
        return (
            <small className="badge badge-danger text-uppercase">
                Bets Ended
            </small>
        )
    } else {
        return (
            <small className="badge badge-success text-uppercase">
                Bets Running
            </small>
        )
    }
}