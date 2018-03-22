import React from 'react'

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
        return <p className="mb-1 teams">{`${team1Name} vs ${team2name}`}</p>
    } else {
        return <p className="mb-1">Loading team names...</p>
    }
}
