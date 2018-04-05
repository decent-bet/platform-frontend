import { BettingProviderActions as Actions } from '../actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultBettingProviderState = {
    address: '',
    house: '0x0',
    sportsOracle: '0x0',
    currentSession: 0,
    balance: 0,
    depositedTokens: 0,
    allowance: 0,
    gamesCount: 0,
    games: {},
    placedBets: {},
    time: null
}

function bettingProviderReducer(
    bettingProvider = DefaultBettingProviderState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Actions.GAMES_COUNT}_${FULFILLED}`:
            return { ...bettingProvider, gamesCount: action.payload }

        case `${Actions.CURRENT_SESSION}_${FULFILLED}`:
            return { ...bettingProvider, currentSession: action.payload }

        case `${Actions.DEPOSITED_TOKENS}_${FULFILLED}`:
            return { ...bettingProvider, depositedTokens: action.payload }

        case `${Actions.TOKEN_BALANCE}_${FULFILLED}`:
            return { ...bettingProvider, balance: action.payload }

        case `${Actions.ALLOWANCE}_${FULFILLED}`:
            return { ...bettingProvider, allowance: action.payload }

        case `${Actions.HOUSE_ADDRESS}_${FULFILLED}`:
            return { ...bettingProvider, house: action.payload }

        case `${Actions.SPORTSORACLE_ADDRESS}_${FULFILLED}`:
            return { ...bettingProvider, sportsOracle: action.payload }

        case `${Actions.GAMES}_${FULFILLED}`:
            return { ...bettingProvider, games: action.payload }

        case `${Actions.GAME_ITEM}_${FULFILLED}`:
            return {
                ...bettingProvider,
                games: {
                    ...bettingProvider.games,
                    [action.meta.gameId]: action.payload
                }
            }

        case `${Actions.GAME_ODDS}_${FULFILLED}`:
            let currentId1 = action.meta.gameId
            return {
                ...bettingProvider,
                games: {
                    ...bettingProvider.games,
                    [currentId1]: {
                        ...bettingProvider.games[currentId1],
                        odds: action.payload
                    }
                }
            }

        case `${Actions.GAME_PERIOD_OUTCOME}_${FULFILLED}`:
            let currentId2 = action.meta.gameId
            return {
                ...bettingProvider,
                games: {
                    ...bettingProvider.games,
                    [currentId2]: {
                        ...bettingProvider[currentId2],
                        outcomes: {
                            ...bettingProvider[currentId2].outcomes,
                            [action.meta.period]: action.payload
                        }
                    }
                }
            }

        case `${Actions.GAME_BET_LIMIT}_${FULFILLED}`:
            let currentId3 = action.meta.gameId
            return {
                ...bettingProvider,
                games: {
                    ...bettingProvider.games,
                    [currentId3]: {
                        ...bettingProvider.games[currentId3],
                        maxBetLimit: action.payload
                    }
                }
            }

        case `${Actions.GAME_BET_LIMIT_FOR_PERIOD}_${FULFILLED}`:
            let currentId4 = action.meta.gameId
            let periodId1 = action.meta.period
            return {
                ...bettingProvider,
                games: {
                    ...bettingProvider.games,
                    [currentId4]: {
                        ...bettingProvider.games[currentId4],
                        betLimits: {
                            ...bettingProvider.games[currentId4].betLimits,
                            [periodId1]: action.payload
                        }
                    }
                }
            }

        case `${Actions.USER_BETS}_${FULFILLED}`:
            return { ...bettingProvider, placedBets: action.payload }

        case `${Actions.TIME}_${FULFILLED}`:
        case Actions.SET_TIME:
            return { ...bettingProvider, time: action.payload }

        case `${Actions.CLAIM_BET}_${FULFILLED}`:
            let currentId5 = action.meta.gameId
            let currentBet1 = action.meta.betId
            let newBetObject = {
                ...bettingProvider.placedBets[currentId5][currentBet1],
                claimed: true
            }
            return {
                ...bettingProvider,
                placedBets: {
                    ...bettingProvider.placedBets,
                    [currentId5]: {
                        ...bettingProvider.placedBets[currentId5],
                        [currentBet1]: newBetObject
                    }
                }
            }

        case `${Actions.ADDRESS}_${FULFILLED}`:
            return { ...bettingProvider, address: action.payload }

        default:
            break
    }

    return bettingProvider
}

export default bettingProviderReducer
