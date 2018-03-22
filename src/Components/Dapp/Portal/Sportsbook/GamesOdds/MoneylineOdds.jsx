import React from 'react'
import BetNowButton from '../BetNowButton'
import { formatOddsNumber, getPeriodDescription } from '../functions'

const constants = require('../../../../Constants')

export default function MoneylineOdds({
    game,
    bettingProviderTime,
    depositedTokens,
    onOpenConfirmBetDialogListener,
    onSetBetAmountListener,
    onSetBetTeamListener,
    onSetTeamTotalListener
}) {
    // Each Row
    let listener = (_odds, index) => {
        //Setup the Buy Button
        let buttonContent = null
        if (bettingProviderTime != null) {
            if (game.cutOffTime < bettingProviderTime) {
                buttonContent = (
                    <BetNowButton
                        oddItem={_odds}
                        oddsType={constants.ODDS_TYPE_MONEYLINE}
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
                {buttonContent}
            </div>
        )
    }
    return (
        <div className="col-12 mt-3">
            <div className="row">
                <div className="col-3">
                    <p className="text-center mt-1 type">MONEYLINE</p>
                </div>
                <div className="col-9">{game.odds.moneyline.map(listener)}</div>
            </div>
        </div>
    )
}
