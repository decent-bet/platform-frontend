import React from 'react'
import SpreadOdds from './SpreadOdds'
import MoneylineOdds from './MoneylineOdds'
import TotalsOdds from './TotalsOdds'
import TotalTeamsOdds from './TotalTeamsOdds'

const constants = require('../../../../Constants')

export default function GameOdds({ game, betNowButtonWrapper }) {
    let odds = game.odds
    if (odds) {
        let gameOdds = {
            spread: [],
            moneyline: [],
            totals: [],
            teamTotals: []
        }

        Object.keys(odds).forEach(oddsId => {
            const _odds = odds[oddsId]
            if (_odds.betType === constants.ODDS_TYPE_SPREAD) {
                gameOdds.spread.push(_odds)
            } else if (_odds.betType === constants.ODDS_TYPE_MONEYLINE) {
                gameOdds.moneyline.push(_odds)
            } else if (_odds.betType === constants.ODDS_TYPE_TOTALS) {
                gameOdds.totals.push(_odds)
            } else if (_odds.betType === constants.ODDS_TYPE_TEAM_TOTALS) {
                gameOdds.teamTotals.push(_odds)
            }
        })

        let content = []
        let parameters = {
            game: game,
            betNowButtonWrapper: betNowButtonWrapper
        }
        if (gameOdds.spread.length > 0) {
            content.push(<SpreadOdds {...parameters} />)
        }
        if (gameOdds.moneyline.length > 0) {
            content.push(<MoneylineOdds {...parameters} />)
        }
        if (gameOdds.totals.length > 0) {
            content.push(<TotalsOdds {...parameters} />)
        }
        if (gameOdds.teamTotals.length > 0) {
            content.push(<TotalTeamsOdds {...parameters} />)
        }
        if (Object.keys(odds).length < 1) {
            content.push(
                <div className="col-12 mt-3">
                    <p className="text-center mt-1 no-odds">
                        NO ODDS AVAILABLE AT THE MOMENT
                    </p>
                </div>
            )
        }

        return <div className="row game-odds">{content}</div>
    } else {
        return (
            <div className="col-12 mt-3">
                <p className="text-center mt-1 no-odds">
                    NO ODDS AVAILABLE AT THE MOMENT
                </p>
            </div>
        )
    }
}
