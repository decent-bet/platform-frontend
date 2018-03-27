import React from 'react'
import GameOddsItem from './GameOddsItem'

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
            content.push(
                <GameOddsItem
                    key="spread"
                    title="Spread"
                    oddsArray={gameOdds.spread}
                    {...parameters}
                />
            )
        }
        if (gameOdds.moneyline.length > 0) {
            content.push(
                <GameOddsItem
                    key="moneyline"
                    title="Moneyline"
                    oddsArray={gameOdds.moneyline}
                    {...parameters}
                />
            )
        }
        if (gameOdds.totals.length > 0) {
            content.push(
                <GameOddsItem
                    key="totals"
                    title="Totals"
                    oddsArray={gameOdds.totals}
                    {...parameters}
                />
            )
        }
        if (gameOdds.teamTotals.length > 0) {
            content.push(
                <GameOddsItem
                    key="tematotals"
                    title="Team Totals"
                    oddsArray={gameOdds.teamTotals}
                    {...parameters}
                />
            )
        }
        if (Object.keys(odds).length < 1) {
            content.push(
                <p className="text-center mt-1 no-odds">
                    NO ODDS AVAILABLE AT THE MOMENT
                </p>
            )
        }

        return <div className="row game-odds">{content}</div>
    } else {
        return (
            <p className="text-center mt-1 no-odds">
                NO ODDS AVAILABLE AT THE MOMENT
            </p>
        )
    }
}
