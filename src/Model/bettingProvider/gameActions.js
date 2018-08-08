import {
    ODDS_TYPE_SPREAD,
    ODDS_TYPE_MONEYLINE,
    BET_CHOICE_TEAM1,
    BET_CHOICE_OVER
} from '../../Components/Constants'
import Helper from '../../Components/Helper'
import { fetchOracleGamesItem } from '../oracle/gameActions'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import ethUnits from 'ethereum-units'

const helper = new Helper()

async function fetchGamePeriodOutcomes(gameId, period, ...args) {
    let { contractFactory } = args

    try {
        let contract = await contractFactory.bettingProviderContract()
        let outcome = await contract.getGameOutcome(gameId, period)

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

async function fetchBetLimits(gameId, period, ...args) {
    let { contractFactory } = args
    try {
        let contract = await contractFactory.bettingProviderContract()
        let limits = await contract.getGamePeriodBetLimits(gameId, period)
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

async function fetchGameOddsItem(gameId, iterator, ...args) {
    let { contractFactory } = args
    let contract = await contractFactory.bettingProviderContract()
    let _odds = await contract.getGameOdds(gameId, iterator)
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

async function fetchGameOddsCount(gameId, ...args) {
    let { contractFactory } = args

    try {
        let contract = await contractFactory.bettingProviderContract()
        let oddsCount = await contract.getGameOddsCount(gameId)
        return oddsCount.toNumber()
    } catch (err) {
        console.log('Error retrieving game odds count ', gameId, err.message)
    }
}

async function fetchMaxBetLimit(gameId, ...args) {
    let { contractFactory } = args

    try {
        let contract = await contractFactory.bettingProviderContract()
        let rawResult = await contract.getGameMaxBetLimit(gameId)
        return helper.formatEther(rawResult.toString())
    } catch (err) {
        console.log('Error retrieving max bet limit', gameId)
    }
}

async function fetchGamesItem(gameId, ...args) {
    let { contractFactory } = args
    let contract = await contractFactory.bettingProviderContract()
    let data = await contract.getGame(gameId)

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
        gameItem.oracleInfo = await fetchOracleGamesItem(gameItem.oracleGameId)
    }
    return gameItem
}

async function fetchGames(...args) {
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

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [Prefix]: {
        [Actions.GET_GAME_ODDS]: [
            fetchGameOdds,
            gameId => ({ gameId: gameId })
        ],

        [Actions.GET_GAME_BET_LIMIT]: [
            fetchMaxBetLimit,
            gameId => ({ gameId: gameId })
        ],

        [Actions.GET_GAME_BET_LIMIT_FOR_PERIOD]: [
            fetchBetLimits,
            (gameId, period) => ({ gameId: gameId, period: period })
        ],

        [Actions.GET_GAME_PERIOD_OUTCOME]: [
            fetchGamePeriodOutcomes,
            (gameId, period) => ({ gameId: gameId, period: period })
        ],

        [Actions.GET_GAME_ITEM]: [
            fetchGamesItem,
            gameId => ({ gameId: gameId })
        ],

        [Actions.GET_GAMES]: fetchGames
    }
})
