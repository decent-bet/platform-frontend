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
function numberDisplay(oddItem, game) {
    switch (oddItem.betType) {
        case ODDS_TYPE_SPREAD:
            return <SpreadOdds oddItem={oddItem} />
        case ODDS_TYPE_MONEYLINE:
            return <MoneylineOdds oddItem={oddItem} />
        case ODDS_TYPE_TOTALS:
            return <TotalOdds oddItem={oddItem} />
        case ODDS_TYPE_TEAM_TOTALS:
            let name = teamName(oddItem.isTeam1, game)
            return <TeamTotalOdds oddItem={oddItem} teamName={name} />
        default:
            return null
    }
}

// Entry Point
export default function GameOddsItemInner({ game, oddItem }) {
    return (
        <div className="row">
            {numberDisplay(oddItem, game)}

            <div className="col">
                <p className="key">Period</p>
                <p>{getPeriodDescription(game, oddItem.period)}</p>
            </div>
        </div>
    )
}
