import React from 'react'
import { formatOddsNumber, getPeriodDescription } from '../functions'

export default function GameOddsItem({
    game,
    betNowButtonWrapper,
    oddsArray,
    title
}) {
    let innerContent = null
    if (oddsArray) {
        // Each Row
        innerContent = oddsArray.map((_odds, index) => {
            return (
                <div className="row" key={index}>
                    <div className="col-3">
                        <p className="key">Home</p>
                        <p>{formatOddsNumber(_odds.team1)}</p>
                    </div>
                    <div className="col-3">
                        <p className="key">Away</p>
                        <p>{formatOddsNumber(_odds.team2)}</p>
                    </div>
                    <div className="col-3">
                        <p className="key">Draw</p>
                        <p>{formatOddsNumber(_odds.draw)}</p>
                    </div>
                    <div className="col-3">
                        <p className="key">Period</p>
                        <p>{getPeriodDescription(game, _odds.period)}</p>
                    </div>
                    <div className="col-12">
                        {// Setup the Buy Button
                        betNowButtonWrapper(_odds, game)}
                    </div>
                </div>
            )
        })
    }
    return (
        <div className="col-12 mt-3">
            <div className="row">
                <div className="col-3">
                    <p className="text-center mt-1 type">{title}</p>
                </div>
                <div className="col-9">{innerContent}</div>
            </div>
        </div>
    )
}
