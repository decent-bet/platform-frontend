import ACTIONS from './Sportsbook/actionTypes'
import Helper from '../../Helper'
import { combineReducers } from 'redux'
import { FULFILLED } from 'redux-promise-middleware'

const helper = new Helper()

function bettingProviderReducer(bettingProvider = {}, action = { type: null }) {
    switch (action.type) {
        case `${ACTIONS.GAMES_COUNT}_${FULFILLED}`:
            bettingProvider.gamesCount = action.payload
            break

        case `${ACTIONS.CURRENT_SESSION}_${FULFILLED}`:
            let currentSession = action.payload.toNumber()
            bettingProvider.currentSession = currentSession
            break

        case `${ACTIONS.DEPOSITED_TOKENS}_${FULFILLED}`:
            let depositedTokens = helper.formatEther(action.payload)
            bettingProvider.depositedTokens = depositedTokens
            break

        case `${ACTIONS.TOKEN_BALANCE}_${FULFILLED}`:
            let balance = action.payload
            balance = helper.formatEther(balance.toString())
            bettingProvider.balance = balance
            break

        case `${ACTIONS.ALLOWANCE}_${FULFILLED}`:
            let allowance = action.payload.toNumber()
            bettingProvider.allowance = allowance
            break

        case `${ACTIONS.HOUSE_ADDRESS}_${FULFILLED}`:
            let houseAddress = action.payload
            bettingProvider.house = houseAddress
            break

        case `${ACTIONS.SPORTSORACLE_ADDRESS}_${FULFILLED}`:
            let sportsOracleAddress = action.payload
            bettingProvider.sportsOracle = sportsOracleAddress
            break

        case `${ACTIONS.GAMES}_${FULFILLED}`:
            let gameArray = action.payload
            bettingProvider.gameArray = gameArray
            break

        case `${ACTIONS.GAME_ODDS}_${FULFILLED}`:
            let odds = action.payload
            let gameId = action.meta.gameId
            let game = bettingProvider.games[gameId]
            if (game) {
                game.odds = odds
            }
            break

        case `${ACTIONS.GAME_PERIOD_OUTCOME}_${FULFILLED}`:
            let outcome = action.payload
            let { gameId2, period } = action.meta
            let game2 = bettingProvider.games[gameId2]
            if (game2) {
                game2.outcomes[period] = outcome
            }
            break

        case `${ACTIONS.GAME_BET_LIMIT}_${FULFILLED}`:
            let gameId3 = action.meta.gameId
            let maxBetLimit = action.payload
            bettingProvider.games[gameId3].maxBetLimit = maxBetLimit
            break

        case `${ACTIONS.USER_BETS}_${FULFILLED}`:
            let userBets = action.payload
            bettingProvider.placedBets = userBets
            break

        case `${ACTIONS.TIME}_${FULFILLED}`:
            bettingProvider.time = action.payload
            break

        case ACTIONS.ADDRESS:
            bettingProvider.address = action.payload
            break

        default:
            break
    }

    return bettingProvider
}

export default combineReducers({
    bettingProvider: bettingProviderReducer
})
