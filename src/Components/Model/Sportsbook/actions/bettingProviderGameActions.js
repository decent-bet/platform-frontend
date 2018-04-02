import {
    ODDS_TYPE_SPREAD,
    ODDS_TYPE_MONEYLINE,
    BET_CHOICE_TEAM1,
    BET_CHOICE_OVER
} from '../../../Constants'
import Helper from '../../../Helper'
import { createAction } from 'redux-actions'
import { BettingProviderActions } from '../actionTypes'

const ethUnits = require('ethereum-units')
const helper = new Helper()

async function fetchGamePeriodOutcomes(gameId, period) {
    try {
        let outcome = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getGameOutcome(gameId, period)

        return {
            result: outcome[0].toNumber(),
            totalPoints: outcome[1].toNumber(),
            team1Points: outcome[2].toNumber(),
            team2Points: outcome[3].toNumber(),
            isPublished: outcome[4],
            settleTime: outcome[5].toNumber()
        }
    } catch (err) {
        console.log('Error retrieving outcomes', gameId, period, err.message)
    }
}

async function fetchBetLimits(gameId, period) {
    try {
        let limits = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getGamePeriodBetLimits(gameId, period)
        let betLimits = limits[0]
        return {
            spread: betLimits[0].div(ethUnits.units.ether).toNumber(),
            moneyline: betLimits[1].div(ethUnits.units.ether).toNumber(),
            totals: betLimits[2].div(ethUnits.units.ether).toNumber(),
            teamTotals: betLimits[3].div(ethUnits.units.ether).toNumber()
        }
    } catch (err) {
        console.log('Error retrieving bet limits', gameId, period, err.message)
    }
}

async function fetchGameOddsItem(gameId, iterator) {
    let _odds = await helper
        .getContractHelper()
        .getWrappers()
        .bettingProvider()
        .getGameOdds(gameId, iterator)
    let gameOdds = {
        id: iterator,
        betType: _odds[0].toNumber(),
        period: _odds[1].toNumber(),
        handicap: _odds[2].toNumber(),
        team1: _odds[3].toNumber(),
        team2: _odds[4].toNumber(),
        draw: _odds[5].toNumber(),
        points: _odds[6].toNumber(),
        over: _odds[7].toNumber(),
        under: _odds[8].toNumber(),
        isTeam1: _odds[9],
        betAmount: 0
    }

    // Default choice
    gameOdds.selectedChoice =
        gameOdds.betType === ODDS_TYPE_SPREAD ||
        gameOdds.betType === ODDS_TYPE_MONEYLINE
            ? BET_CHOICE_TEAM1
            : BET_CHOICE_OVER

    // Normalize
    if (gameOdds.handicap !== 0) gameOdds.handicap /= 100
    if (gameOdds.points !== 0) gameOdds.points /= 100

    return gameOdds
}

async function fetchGameOdds(gameId) {
    try {
        let result = []
        let oddsCount = await fetchGameOddsCount(gameId)
        for (let iterator = 0; iterator < oddsCount; iterator++) {
            // Add to array
            let gameOdds = await fetchGameOddsItem(gameId, iterator)
            result.push(gameOdds)
        }

        return result
    } catch (error) {
        console.log('Error retrieving odds for game', gameId, error.message)
    }
}

async function fetchGameOddsCount(gameId) {
    try {
        let oddsCount = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getGameOddsCount(gameId)
        return oddsCount.toNumber()
    } catch (err) {
        console.log('Error retrieving game odds count ', gameId, err.message)
    }
}

async function fetchMaxBetLimit(gameId) {
    try {
        let rawResult = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getGameMaxBetLimit(gameId)
        return helper.formatEther(rawResult.toString())
    } catch (err) {
        console.log('Error retrieving max bet limit', gameId)
    }
}

async function fetchGamesItem(gameId) {
    let data = await helper
        .getContractHelper()
        .getWrappers()
        .bettingProvider()
        .getGame(gameId)

    let exists = data[8]
    let gameItem = null

    //Parse if it exists
    if (exists) {
        gameItem = {
            id: gameId,
            oracleGameId: data[0].toNumber(),
            session: data[1].toNumber(),
            betAmount: data[2].div(ethUnits.units.ether).toString(),
            payouts: data[3].toFixed(0),
            betCount: data[4].toNumber(),
            cutOffTime: data[5].toNumber(),
            endTime: data[6].toNumber(),
            hasEnded: data[7],
            exists: exists,
            betLimits: {},
            outcomes: {},
            maxBetLimit: 0
        }

        //Retrieve extra data
        gameItem.odds = await fetchGameOdds(gameId)
        for (const gameOdds of gameItem.odds) {
            let betLimits = await fetchBetLimits(gameId, gameOdds.period)
            let outcome = await fetchGamePeriodOutcomes(gameId, gameOdds.period)
            gameItem.betLimits[gameOdds.period] = betLimits
            gameItem.outcomes[gameOdds.period] = outcome
        }
        let maxBetLimit = await fetchMaxBetLimit(gameId)
        gameItem.maxBetLimit = maxBetLimit.toString()
    }
    return gameItem
}

async function fetchGames() {
    let currentId = 0
    let gameArray = []
    try {
        let iterate = true
        while (iterate) {
            let gameItem = await fetchGamesItem(currentId)
            if (gameItem) {
                // Setup as an sparse array
                gameArray[currentId] = gameItem
                currentId++
            } else {
                iterate = false
            }
        }
    } catch (error) {
        console.log('Reached end of provider games')
    }

    return gameArray
}

export const getGameOddsCount = createAction(
    BettingProviderActions.GAME_ODDS_COUNT,
    fetchGameOddsCount,
    gameId => ({ gameId: gameId })
)
export const getGameOdds = createAction(
    BettingProviderActions.GAME_ODDS,
    fetchGameOdds,
    gameId => ({ gameId: gameId })
)
export const getMaxBetLimit = createAction(
    BettingProviderActions.GAME_BET_LIMIT,
    fetchMaxBetLimit,
    gameId => ({ gameId: gameId })
)
export const getBetLimitForPeriod = createAction(
    BettingProviderActions.GAME_BET_LIMIT_FOR_PERIOD,
    fetchBetLimits,
    (gameId, period) => ({ gameId: gameId, period: period })
)
export const getGamePeriodOutcome = createAction(
    BettingProviderActions.GAME_ODDS,
    fetchGamePeriodOutcomes,
    (gameId, period) => ({ gameId: gameId, period: period })
)
export const getGameItem = createAction(
    BettingProviderActions.GAME_ITEM,
    fetchGamesItem,
    gameId => ({ gameId: gameId })
)
export const getGames = createAction(BettingProviderActions.GAMES, fetchGames)
