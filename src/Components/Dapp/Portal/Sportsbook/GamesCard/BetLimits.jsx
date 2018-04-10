import React from 'react'
import { getPeriodDescription } from '../functions'

export default function BetLimits({ game }) {
    const betLimits = game.betLimits
    const maxBetLimit = game.maxBetLimit
    const betLimitArray = []
    for (const period in betLimits) {
        if (betLimits.hasOwnProperty(period)) {
            const element = betLimits[period]
            betLimitArray.push(
                <div className="row" key={period}>
                    <div className="col-12 mb-3">
                        <p className="text-center key">PERIOD</p>
                        <p className="text-center">
                            {getPeriodDescription(game, parseInt(period, 10))}
                        </p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">SPREAD</p>
                        <p className="text-center">{element.spread} DBETs</p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">MONEYLINE</p>
                        <p className="text-center">{element.moneyline} DBETs</p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">TOTALS</p>
                        <p className="text-center">{element.totals} DBETs</p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">TEAM TOTALS</p>
                        <p className="text-center">
                            {element.teamTotals} DBETs
                        </p>
                    </div>
                </div>
            )
        }
    }
    return (
        <div className="col-12 bet-limits">
            <div className="row">
                <div className="col-12 mb-3">
                    <p className="text-center key">MAX BET LIMIT</p>
                    <p className="text-center">{maxBetLimit} DBETs</p>
                </div>
            </div>
            {betLimitArray}
        </div>
    )
}
