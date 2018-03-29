import { BettingProviderActions as Actions } from '../actionTypes'
import Helper from '../../Helper'
import { FULFILLED } from 'redux-promise-middleware'

const helper = new Helper()

function bettingProviderReducer(bettingProvider = {}, action = { type: null }) {
    switch (action.type) {
        case `${Actions.GAMES_COUNT}_${FULFILLED}`:
            bettingProvider.gamesCount = action.payload
            break

        case `${Actions.CURRENT_SESSION}_${FULFILLED}`:
            let currentSession = action.payload.toNumber()
            bettingProvider.currentSession = currentSession
            break

        case `${Actions.DEPOSITED_TOKENS}_${FULFILLED}`:
            let depositedTokens = helper.formatEther(action.payload)
            bettingProvider.depositedTokens = depositedTokens
            break

        case `${Actions.TOKEN_BALANCE}_${FULFILLED}`:
            let balance = action.payload
            balance = helper.formatEther(balance.toString())
            bettingProvider.balance = balance
            break

        case `${Actions.ALLOWANCE}_${FULFILLED}`:
            let allowance = action.payload.toNumber()
            bettingProvider.allowance = allowance
            break

        case `${Actions.HOUSE_ADDRESS}_${FULFILLED}`:
            let houseAddress = action.payload
            bettingProvider.house = houseAddress
            break

        case `${Actions.SPORTSORACLE_ADDRESS}_${FULFILLED}`:
            let sportsOracleAddress = action.payload
            bettingProvider.sportsOracle = sportsOracleAddress
            break

        case `${Actions.GAMES}_${FULFILLED}`:
            let gameArray = action.payload
            bettingProvider.gameArray = gameArray
            break

        case `${Actions.GAME_ODDS}_${FULFILLED}`:
            let odds = action.payload
            let gameId = action.meta.gameId
            let game = bettingProvider.games[gameId]
            if (game) {
                game.odds = odds
            }
            break

        case `${Actions.GAME_PERIOD_OUTCOME}_${FULFILLED}`:
            let outcome = action.payload
            let { gameId2, period } = action.meta
            let game2 = bettingProvider.games[gameId2]
            if (game2) {
                game2.outcomes[period] = outcome
            }
            break

        case `${Actions.GAME_BET_LIMIT}_${FULFILLED}`:
            let gameId3 = action.meta.gameId
            let maxBetLimit = action.payload
            bettingProvider.games[gameId3].maxBetLimit = maxBetLimit
            break

        case `${Actions.USER_BETS}_${FULFILLED}`:
            let userBets = action.payload
            bettingProvider.placedBets = userBets
            break

        case `${Actions.TIME}_${FULFILLED}`:
            bettingProvider.time = action.payload
            break

        case Actions.ADDRESS:
            bettingProvider.address = action.payload
            break

        default:
            break
    }

    return bettingProvider
}

export default bettingProviderReducer
