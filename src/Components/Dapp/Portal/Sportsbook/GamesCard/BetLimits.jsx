import React from 'react'
import { getPeriodDescription } from '../functions'

export default function BetLimits({ game }) {
    const betLimits = game.betLimits
    const maxBetLimit = game.maxBetLimit
    return (
        <div className="col-12 bet-limits">
            <div className="row">
                <div className="col-12 mb-3">
                    <p className="text-center key">MAX BET LIMIT</p>
                    <p className="text-center">{maxBetLimit} DBETs</p>
                </div>
            </div>
            {Object.keys(betLimits).map(period => (
                <div className="row">
                    <div className="col-12 mb-3">
                        <p className="text-center key">PERIOD</p>
                        <p className="text-center">
                            {getPeriodDescription(game, period)}
                        </p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">SPREAD</p>
                        <p className="text-center">
                            {betLimits[period].spread} DBETs
                        </p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">MONEYLINE</p>
                        <p className="text-center">
                            {betLimits[period].moneyline} DBETs
                        </p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">TOTALS</p>
                        <p className="text-center">
                            {betLimits[period].totals} DBETs
                        </p>
                    </div>
                    <div className="col-3">
                        <p className="text-center key">TEAM TOTALS</p>
                        <p className="text-center">
                            {betLimits[period].teamTotals} DBETs
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
