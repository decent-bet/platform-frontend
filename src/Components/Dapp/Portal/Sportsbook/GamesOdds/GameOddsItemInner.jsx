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

// Get the name of the team in the TeamOdds
function teamName(isTeam1, game) {
    if (game) {
        if (game.oracleInfo) {
            return isTeam1 ? game.oracleInfo.team1 : game.oracleInfo.team2
        }
    }
    return 'Loading...'
}

// Switch between the display of the different odd types
function numberDisplay(oddsItem, game) {
    switch (oddsItem.betType) {
        case ODDS_TYPE_SPREAD:
            return <SpreadOdds oddItem={oddsItem} />
        case ODDS_TYPE_MONEYLINE:
            return <MoneylineOdds oddItem={oddsItem} />
        case ODDS_TYPE_TOTALS:
            return <TotalOdds oddItem={oddsItem} />
        case ODDS_TYPE_TEAM_TOTALS:
            let name = teamName(oddsItem.isTeam1, game)
            return <TeamTotalOdds oddItem={oddsItem} teamName={name} />
        default:
            return null
    }
}

// Entry Point
export default function GameOddsItemInner({ game, oddsItem }) {
    return (
        <div className="row">
            {numberDisplay(oddsItem, game)}

            <div className="col">
                <p className="key">Period</p>
                <p>{getPeriodDescription(game, oddsItem.period)}</p>
            </div>
        </div>
    )
}
