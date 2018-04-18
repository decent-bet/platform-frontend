import bettingReturnsCalculator from '../BettingReturnsCalculator'
import * as constants from '../../../Constants'

const BettingReturnsCalculator = new bettingReturnsCalculator()

export function formatOddsNumber(val) {
    return val > 0 ? '+' + val : val
}

export function getPeriodDescription(game, periodNumber) {
    let periodDescription = 'Loading..'
    if (game.oracleInfo && game.oracleInfo.periodDescriptions) {
        for (let _period of game.oracleInfo.periodDescriptions) {
            if (_period.number === periodNumber) {
                periodDescription = _period.description
            }
        }
    }

    return periodDescription
}

function getFormattedOddsType(type) {
    switch (type) {
        case constants.ODDS_TYPE_SPREAD:
            return constants.FORMATTED_ODDS_TYPE_SPREAD
        case constants.ODDS_TYPE_MONEYLINE:
            return constants.FORMATTED_ODDS_TYPE_MONEYLINE
        case constants.ODDS_TYPE_TOTALS:
            return constants.FORMATTED_ODDS_TYPE_TOTALS
        case constants.ODDS_TYPE_TEAM_TOTALS:
            return constants.FORMATTED_ODDS_TYPE_TEAM_TOTALS
        default:
            return ''
    }
}

export function getFormattedOdds(oddsItem) {
    let formattedOddsType = getFormattedOddsType(oddsItem.betType)
    if (oddsItem.betType === constants.ODDS_TYPE_SPREAD) {
        return (
            formattedOddsType +
            ' - Hdp: ' +
            oddsItem.handicap +
            ', Home: ' +
            oddsItem.team1 +
            ', Away: ' +
            oddsItem.team2
        )
    } else if (oddsItem.betType === constants.ODDS_TYPE_MONEYLINE) {
        return (
            formattedOddsType +
            ', Home: ' +
            oddsItem.team1 +
            ', Away: ' +
            oddsItem.team2 +
            ', Draw: ' +
            oddsItem.draw
        )
    } else if (
        oddsItem.betType === constants.ODDS_TYPE_TOTALS ||
        oddsItem.betType === constants.ODDS_TYPE_TEAM_TOTALS
    ) {
        return (
            formattedOddsType +
            ', Points: ' +
            oddsItem.points +
            ', Over: ' +
            oddsItem.over +
            ', Under: ' +
            oddsItem.under
        )
    }
}

export function getFormattedBetChoice(game, choice) {
    switch (choice) {
        case constants.BET_CHOICE_TEAM1:
        case constants.BET_CHOICE_TEAM2:
            let isHome = choice === constants.BET_CHOICE_TEAM1
            return game.oracleInfo[isHome ? 'team1' : 'team2']

        case constants.BET_CHOICE_DRAW:
            return 'Draw'
        case constants.BET_CHOICE_OVER:
            return 'Over'
        case constants.BET_CHOICE_UNDER:
            return 'Under'

        default:
            return ''
    }
}

export function isGameOutcomeAvailable(gameItem, period) {
    let outcome = gameItem.outcomes[period]
    return outcome ? outcome.isPublished : null
}

export function getGameOutcome(gameItem, period) {
    if (!isGameOutcomeAvailable(gameItem, period)) return 'Not Published'
    else {
        let outcome = gameItem.outcomes[period]
        return outcome
            ? getFormattedBetChoice(gameItem, outcome.result) +
                  ', ' +
                  outcome.team1Points +
                  ':' +
                  outcome.team2Points +
                  ', Total: ' +
                  outcome.totalPoints
            : 'Loading...'
    }
}

export function isWinningBet(gameItem, oddsObj, placedBet) {
    let period = oddsObj.period
    let outcome = gameItem.outcomes[period]
    let choice = placedBet.choice
    let result = outcome.result

    if (oddsObj.betType === constants.ODDS_TYPE_SPREAD) {
        return (
            (choice === constants.BET_CHOICE_TEAM1 &&
                outcome.team1Points + oddsObj.handicap > outcome.team2Points) ||
            (choice === constants.BET_CHOICE_TEAM2 &&
                outcome.team2Points + oddsObj.handicap > outcome.team1Points)
        )
    } else {
        if (
            (oddsObj.betType === constants.ODDS_TYPE_MONEYLINE &&
                choice === result) ||
            oddsObj.betType === constants.ODDS_TYPE_TEAM_TOTALS
        )
            return true
        else if (
            oddsObj.betType === constants.ODDS_TYPE_TOTALS &&
            outcome.totalPoints > oddsObj.points &&
            placedBet.choice === constants.BET_CHOICE_OVER
        )
            return true
        else if (
            oddsObj.betType === constants.ODDS_TYPE_TOTALS &&
            outcome.totalPoints < oddsObj.points &&
            placedBet.choice === constants.BET_CHOICE_UNDER
        )
            return true
        else if (
            oddsObj.betType === constants.ODDS_TYPE_TEAM_TOTALS &&
            outcome.team1Points > oddsObj.team1 &&
            placedBet.choice === constants.BET_CHOICE_OVER
        )
            return true
        else if (
            oddsObj.betType === constants.ODDS_TYPE_TEAM_TOTALS &&
            outcome.team1Points < oddsObj.team1 &&
            placedBet.choice === constants.BET_CHOICE_UNDER
        )
            return true
        else if (
            oddsObj.betType === constants.ODDS_TYPE_TEAM_TOTALS &&
            outcome.team2Points > oddsObj.team2 &&
            placedBet.choice === constants.BET_CHOICE_OVER
        )
            return true
        else if (
            oddsObj.betType === constants.ODDS_TYPE_TEAM_TOTALS &&
            outcome.team2Points < oddsObj.team2 &&
            placedBet.choice === constants.BET_CHOICE_UNDER
        )
            return true
        else return false
    }
}

export function getWinnings(gameItem, oddsObj, placedBet) {
    let period = oddsObj.period

    // No outcome available
    if (!isGameOutcomeAvailable(gameItem, period)) return 0

    let outcome = gameItem.outcomes[period]

    // No outcome
    if (!outcome) return 0

    let choice = placedBet.choice
    let betAmount = placedBet.amount

    // Losers get nothing.
    if (!isWinningBet(gameItem, oddsObj, placedBet)) return 0

    let teamOdds =
        choice === constants.BET_CHOICE_TEAM1 ? oddsObj.team1 : oddsObj.team2
    if (oddsObj.betType === constants.ODDS_TYPE_SPREAD) {
        return BettingReturnsCalculator
            .getSpreadReturns(
                betAmount,
                oddsObj.handicap,
                outcome.team1Points,
                outcome.team2Points,
                placedBet.choice,
                teamOdds
            )
            .toFixed(2)
    } else {
        return BettingReturnsCalculator.getMaxReturns(
            oddsObj,
            choice,
            betAmount
        )
    }
}
