import React from 'react'
import { getPeriodDescription } from '../functions'
import {
    ODDS_TYPE_SPREAD,
    ODDS_TYPE_MONEYLINE,
    ODDS_TYPE_TOTALS,
    ODDS_TYPE_TEAM_TOTALS
} from '../../../../Constants'
import SpreadOdds from './SpreadOdds'
import MoneylineOdds from './MoneylineOdds'
import TotalOdds from './TotalOdds'
import TeamTotalOdds from './TeamTotalOdds'

function teamName(isTeam1, game) {
    if (game) {
        if (game.oracleInfo) {
            return isTeam1 ? game.oracleInfo.team1 : game.oracleInfo.team2
        }
    }
    return 'Loading...'
}

function numberDisplay(_odds, game) {
    switch (_odds.betType) {
        case ODDS_TYPE_SPREAD:
            return <SpreadOdds oddItem={_odds} />
        case ODDS_TYPE_MONEYLINE:
            return <MoneylineOdds oddItem={_odds} />
        case ODDS_TYPE_TOTALS:
            return <TotalOdds oddItem={_odds} />
        case ODDS_TYPE_TEAM_TOTALS:
            let name = teamName(_odds.isTeam1, game)
            return <TeamTotalOdds oddItem={_odds} teamName={name} />
        default:
            return null
    }
}

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
                    {numberDisplay(_odds, game)}

                    <div className="col">
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
