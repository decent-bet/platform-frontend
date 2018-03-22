import React from 'react'
import BetNowButton from '../BetNowButton'
import { formatOddsNumber, getPeriodDescription } from '../functions'

const constants = require('../../../../Constants')

export default function TotalsOdds({
    game,
    bettingProviderTime,
    depositedTokens,
    onSetBetAmountListener,
    onSetBetTeamListener,
    onSetTeamTotalListener,
    onOpenConfirmBetDialogListener
}) {
    // Each row
    let listener = (_odds, index) => {
        //Setup the Buy Button
        let buttonContent = null
        if (bettingProviderTime != null) {
            if (game.cutOffTime < bettingProviderTime) {
                buttonContent = (
                    <BetNowButton
                        oddItem={_odds}
                        oddsType={constants.ODDS_TYPE_TOTALS}
                        game={game}
                        depositedTokens={depositedTokens}
                        bettingProviderTime={bettingProviderTime}
                        onSetBetAmountListener={onSetBetAmountListener}
                        onSetBetTeamListener={onSetBetTeamListener}
                        onSetTeamTotalListener={onSetTeamTotalListener}
                        onOpenConfirmBetDialogListener={
                            onOpenConfirmBetDialogListener
                        }
                    />
                )
            }
        }

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
                {buttonContent}
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
