import React from 'react'
import { formatOddsNumber, getPeriodDescription } from '../functions'

const constants = require('../../../../Constants')

export default function SpreadOdds({ game, betNowButtonWrapper }) {
    //Each row
    let listener = (_odds, index) => {
        return (
            <div className="row" key={index}>
                <div className="col-3">
                    <p className="key">Handicap</p>
                    <p>{formatOddsNumber(_odds.handicap)}</p>
                </div>
                <div className="col-3">
                    <p className="key">Home</p>
                    <p>{formatOddsNumber(_odds.team1)}</p>
                </div>
                <div className="col-3">
                    <p className="key">Away</p>
                    <p>{formatOddsNumber(_odds.team2)}</p>
                </div>
                <div className="col-3">
                    <p className="key">Period</p>
                    <p>{getPeriodDescription(game, _odds.period)}</p>
                </div>
                {// Setup the Buy Button
                betNowButtonWrapper(_odds, constants.ODDS_TYPE_SPREAD, game)}
            </div>
        )
    }

    return (
        <div className="col-12">
            <div className="row">
                <div className="col-3">
                    <p className="text-center mt-1 type">SPREAD</p>
                </div>
                <div className="col-9">{game.odds.spread.map(listener)}</div>
            </div>
        </div>
    )
}
