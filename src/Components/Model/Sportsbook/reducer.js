import ACTIONS from './Sportsbook/actionTypes'
import Helper from '../../Helper'

const helper = new Helper()

export default function sportsBookReducer(state = {}, action = { type: null }) {
    let bettingProvider = state.bettingProvider
    switch (action.type) {
        case `${ACTIONS.GAMES_COUNT}_FULFILLED`:
            bettingProvider.gamesCount = action.payload
            break

        case `${ACTIONS.CURRENT_SESSION}_FULFILLED`:
            let currentSession = action.payload.toNumber()
            bettingProvider.currentSession = currentSession
            break

        case `${ACTIONS.DEPOSITED_TOKENS}_FULFILLED`:
            let depositedTokens = helper.formatEther(action.payload)
            bettingProvider.depositedTokens = depositedTokens
            break

        case `${ACTIONS.TOKEN_BALANCE}_FULFILLED`:
            let balance = action.payload
            balance = helper.formatEther(balance.toString())
            bettingProvider.balance = balance
            break

        case `${ACTIONS.ALLOWANCE}_FULFILLED`:
            let allowance = action.payload.toNumber()
            bettingProvider.allowance = allowance
            break

        case `${ACTIONS.HOUSE_ADDRESS}_FULFILLED`:
            let houseAddress = action.payload
            bettingProvider.house = houseAddress
            break

        case `${ACTIONS.SPORTSORACLE_ADDRESS}_FULFILLED`:
            let sportsOracleAddress = action.payload
            bettingProvider.sportsOracle = sportsOracleAddress
            break

        case `${ACTIONS.GAMES}_FULFILLED`:
            let gameArray = action.payload
            bettingProvider.gameArray = gameArray
            break

        case `${ACTIONS.GAME_ODDS}_FULFILLED`:
            let odds = action.payload
            let gameId = action.meta.gameId
            let game = bettingProvider.games[gameId]
            if (game) {
                game.odds = odds
            }
            break

        case `${ACTIONS.GAME_PERIOD_OUTCOME}_FULFILLED`:
            let outcome = action.payload
            let { gameId, period } = action.meta
            let game = bettingProvider.games[gameId]
            if (game) {
                game.outcomes[period] = outcome
            }
            break

        case `${ACTIONS.GAME_BET_LIMIT}_FULFILLED`:
            let gameId = action.meta.gameId
            let maxBetLimit = action.payload
            bettingProvider.games[gameId].maxBetLimit = maxBetLimit
            break

        case `${ACTIONS.USER_BETS}_FULFILLED`:
            let userBets = action.payload
            bettingProvider.placedBets = userBets
            break

        case `${ACTIONS.TIME}_FULFILLED`:
            bettingProvider.time = action.payload
            break

        case ACTIONS.ADDRESS:
            bettingProvider.address = action.payload
            break

        default:
            break
    }

    return {
        ...state,
        bettingProvider
    }
}
