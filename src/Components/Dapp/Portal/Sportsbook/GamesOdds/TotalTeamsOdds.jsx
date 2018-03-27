import React from 'react'
import { formatOddsNumber, getPeriodDescription } from '../functions'

const constants = require('../../../../Constants')

export default function TotalTeamssOdds({ game, betNowButtonWrapper }) {
    // Each row
    let listener = (_odds, index) => {
        return (
            <div className="row mt-1">
                <div className="col-2">
                    <p className="key">Team</p>
                    <p>{_odds.isTeam1 ? 'Home' : 'Away'}</p>
                </div>
                <div className="col-2">
                    <p className="key">Points</p>
                    <p>{formatOddsNumber(_odds.points)}</p>
                </div>
                <div className="col-2">
                    <p className="key">Over</p>
                    <p>{formatOddsNumber(_odds.over)}</p>
                </div>
                <div className="col-2">
                    <p className="key">Under</p>
                    <p>{formatOddsNumber(_odds.under)}</p>
                </div>
                <div className="col-3">
                    <p className="key">Period</p>
                    <p>{getPeriodDescription(game, _odds.period)}</p>
                </div>
                <div className="col-12 mt-1 mb-4">
                    {// Setup the Buy Button
                    betNowButtonWrapper(
                        _odds,
                        constants.ODDS_TYPE_TEAM_TOTALS,
                        game
                    )}
                </div>
            </div>
        )
    }
    return (
        <div className="col-12 mt-3">
            <div className="row">
                <div className="col-3">
                    <p className="text-center mt-1 type">TEAM TOTALS</p>
                </div>
                <div className="col-9">
                    {game.odds.teamTotals.map(listener)}
                </div>
            </div>
        </div>
    )
}
