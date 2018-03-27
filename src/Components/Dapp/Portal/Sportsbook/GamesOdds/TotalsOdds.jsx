import React from 'react'
import { formatOddsNumber, getPeriodDescription } from '../functions'

const constants = require('../../../../Constants')

export default function TotalsOdds({ game, betNowButtonWrapper }) {
    // Each row
    let listener = (_odds, index) => {
        return (
            <div className="row" key={index}>
                <div className="col-3">
                    <p className="key">Points</p>
                    <p>{formatOddsNumber(_odds.points)}</p>
                </div>
                <div className="col-3">
                    <p className="key">Over</p>
                    <p>{formatOddsNumber(_odds.over)}</p>
                </div>
                <div className="col-3">
                    <p className="key">Under</p>
                    <p>{formatOddsNumber(_odds.under)}</p>
                </div>
                <div className="col-3">
                    <p className="key">Period</p>
                    <p>{getPeriodDescription(game, _odds.period)}</p>
                </div>
                
                {// Setup the Buy Button
                betNowButtonWrapper(_odds, constants.ODDS_TYPE_TOTALS, game)}
            </div>
        )
    }
    return (
        <div className="col-12 mt-3">
            <div className="row">
                <div className="col-3">
                    <p className="text-center mt-1 type">TOTALS</p>
                </div>
                <div className="col-9">{game.odds.totals.map(listener)}</div>
            </div>
        </div>
    )
}
