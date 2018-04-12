import Actions, { Prefix } from './actionTypes'
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

export default function bettingProviderReducer(
    bettingProvider = DefaultBettingProviderState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.GET_GAMES_COUNT}/${FULFILLED}`:
            return { ...bettingProvider, gamesCount: action.payload }

        case `${Prefix}/${Actions.GET_CURRENT_SESSION}/${FULFILLED}`:
            return { ...bettingProvider, currentSession: action.payload }

        case `${Prefix}/${Actions.GET_DEPOSITED_TOKENS}/${FULFILLED}`:
            return { ...bettingProvider, depositedTokens: action.payload }

        case `${Prefix}/${Actions.GET_TOKEN_BALANCE}/${FULFILLED}`:
            return { ...bettingProvider, balance: action.payload }

        case `${Prefix}/${Actions.GET_ALLOWANCE}/${FULFILLED}`:
            return { ...bettingProvider, allowance: action.payload }

        case `${Prefix}/${Actions.GET_HOUSE_ADDRESS}/${FULFILLED}`:
            return { ...bettingProvider, house: action.payload }

        case `${Prefix}/${Actions.GET_SPORTSORACLE_ADDRESS}/${FULFILLED}`:
            return { ...bettingProvider, sportsOracle: action.payload }

        case `${Prefix}/${Actions.GET_GAMES}/${FULFILLED}`:
            return { ...bettingProvider, games: action.payload }

        case `${Prefix}/${Actions.GET_GAME_ITEM}/${FULFILLED}`:
            return {
                ...bettingProvider,
                games: {
                    ...bettingProvider.games,
                    [action.meta.gameId]: action.payload
                }
            }

        case `${Prefix}/${Actions.GET_GAME_ODDS}/${FULFILLED}`:
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

        case `${Prefix}/${Actions.GET_GAME_PERIOD_OUTCOME}/${FULFILLED}`:
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

        case `${Prefix}/${Actions.GET_GAME_BET_LIMIT}/${FULFILLED}`:
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

        case `${Prefix}/${Actions.GET_GAME_BET_LIMIT_FOR_PERIOD}/${FULFILLED}`:
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

        case `${Prefix}/${Actions.GET_USER_BETS}/${FULFILLED}`:
            return { ...bettingProvider, placedBets: action.payload }

        case `${Prefix}/${Actions.GET_TIME}/${FULFILLED}`:
        case `${Prefix}/${Actions.SET_TIME}`:
            return { ...bettingProvider, time: action.payload }

        case `${Prefix}/${Actions.CLAIM_BET}/${FULFILLED}`:
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

        case `${Prefix}/${Actions.GET_ADDRESS}/${FULFILLED}`:
            return { ...bettingProvider, address: action.payload }

        default:
            return { ...bettingProvider }
    }
}
