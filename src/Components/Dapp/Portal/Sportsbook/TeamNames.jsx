import React from 'react'
import { Typography } from '@material-ui/core'

function hasTeamNamesInOracle(oracleGame) {
    if (oracleGame) {
        return (
            oracleGame.hasOwnProperty('team1') &&
            oracleGame.hasOwnProperty('team2')
        )
    } else {
        return false
    }
}

export default function TeamNames({ game }) {
    let isTeamNamesAvailable = hasTeamNamesInOracle(game.oracleInfo)
    if (isTeamNamesAvailable) {
        let team1Name = game.oracleInfo.team1
        let team2name = game.oracleInfo.team2
        return (
            <Typography className="mb-1 teams">{`${team1Name} vs ${team2name}`}</Typography>
        )
    } else {
        return <Typography className="mb-1">Loading team names...</Typography>
    }
}
