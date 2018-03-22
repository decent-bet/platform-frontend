function formatOddsNumber(val) {
    return val > 0 ? '+' + val : val
}

function getPeriodDescription(game, periodNumber) {
    let periodDescription = 'Loading..'
    if (game.oracleInfo && game.oracleInfo.periodDescriptions) {
        for (let _period of game.oracleInfo.periodDescriptions){
            if (_period.number === periodNumber) {
                periodDescription = _period.description
            }
        }
    }

    return periodDescription
}

export { formatOddsNumber, getPeriodDescription }
