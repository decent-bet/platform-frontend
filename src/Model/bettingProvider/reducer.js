import Actions, { Prefix } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultAction = { type: null, payload: null }

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

/**
 * Handles the reduction of a single GameItem
 * @param {any} gameItem
 * @param {DefaultAction} action
 */
function gameItemSubReducer(gameItem = {}, action = DefaultAction) {
    const { period } = action.meta
    switch (action.type) {
        case `${Prefix}/${Actions.GET_GAME_ODDS}/${FULFILLED}`:
            return { ...gameItem, odds: action.payload }

        case `${Prefix}/${Actions.GET_GAME_PERIOD_OUTCOME}/${FULFILLED}`:
            return {
                ...gameItem,
                outcomes: { ...gameItem.outcomes, [period]: action.payload }
            }

        case `${Prefix}/${Actions.GET_GAME_BET_LIMIT}/${FULFILLED}`:
            return { ...gameItem, maxBetLimit: action.payload }

        case `${Prefix}/${Actions.GET_GAME_BET_LIMIT_FOR_PERIOD}/${FULFILLED}`:
            return {
                ...gameItem,
                betLimits: { ...gameItem.betLimits, [period]: action.payload }
            }

        default:
            return { ...gameItem }
    }
}

/**
 * Handles the reduction of a list of GameItems
 * @param {any} gamesListState
 * @param {DefaultAction} action
 */
function gamesListSubreducer(gamesListState = {}, action = DefaultAction) {
    if (!action.meta) return { ...gamesListState }
    const { gameId } = action.meta
    if (gameId === undefined) return { ...gamesListState }

    switch (action.type) {
        case `${Prefix}/${Actions.GET_GAME_ITEM}/${FULFILLED}`:
            return { ...gamesListState, [gameId]: action.payload }

        default:
            // Null protection
            let gameItem = gamesListState[gameId]
            if (!gameItem) gameItem = {}
            return {
                ...gamesListState,
                [gameId]: gameItemSubReducer(gameItem, action)
            }
    }
}

/**
 * Reduces the array of Placed Bets
 * @param {any} placedBets
 * @param {DefaultAction} action
 */
function placedBetsSubreducer(placedBets = {}, action = DefaultAction) {
    if (!action.meta) return { ...placedBets }
    const { gameId, betId } = action.meta

    switch (action.type) {
        case `${Prefix}/${Actions.CLAIM_BET}/${FULFILLED}`:
            let gameBetsList = placedBets[gameId]
            if (!gameBetsList) gameBetsList = {}
            let newBetObject = { ...gameBetsList[betId], claimed: true }

            return {
                ...placedBets,
                [gameId]: { ...placedBets[gameId], [betId]: newBetObject }
            }
        default:
            return { ...placedBets }
    }
}

/**
 * Main Reducer for the BettingProvider
 * @param {any} bettingProvider
 * @param {DefaultAction} action
 */
export default function bettingProviderReducer(
    bettingProvider = DefaultBettingProviderState,
    action = DefaultAction
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

        case `${Prefix}/${Actions.GET_USER_BETS}/${FULFILLED}`:
            return { ...bettingProvider, placedBets: action.payload }

        case `${Prefix}/${Actions.GET_TIME}/${FULFILLED}`:
        case `${Prefix}/${Actions.SET_TIME}`:
            return { ...bettingProvider, time: action.payload }

        case `${Prefix}/${Actions.GET_ADDRESS}/${FULFILLED}`:
            return { ...bettingProvider, address: action.payload }

        default:
            return {
                ...bettingProvider,
                games: gamesListSubreducer(bettingProvider.games, action),
                placedBets: placedBetsSubreducer(
                    bettingProvider.placedBets,
                    action
                )
            }
    }
}
