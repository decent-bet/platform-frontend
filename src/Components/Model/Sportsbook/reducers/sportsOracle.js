import { OracleActions as Actions } from '../actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultOracleState = {
    owner: '',
    balance: 0,
    gamesCount: 0,
    payments: {
        gameUpdateCost: 0,
        providerAcceptanceCost: 0,
        payForProviderAcceptance: false
    },
    addresses: {
        authorizedAddresses: [],
        requestedProviderAddresses: [],
        acceptedProviderAddresses: []
    },
    games: {},
    time: null
}

function oracleReducer(
    sportsOracle = DefaultOracleState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Actions.GET_OWNER}_${FULFILLED}`:
            sportsOracle.owner = action.payload
            break

        case `${Actions.GET_GAMES}_${FULFILLED}`:
            sportsOracle.games = action.payload
            break

        case `${Actions.GET_GAME_ITEM}_${FULFILLED}`:
            let game = action.payload
            sportsOracle.games[game.id] = game
            break

        case `${Actions.GET_GAME_UPDATE_COST}_${FULFILLED}`:
            sportsOracle.payments.gameUpdateCost = action.payload
            break

        case `${Actions.GET_REQUESTED_PROVIDER_ADDRESSES}_${FULFILLED}`:
            sportsOracle.addresses.requestedProviderAddresses = action.payload
            break

        case `${Actions.GET_ACCEPTED_PROVIDER_ADDRESSES}_${FULFILLED}`:
            sportsOracle.addresses.acceptedProviderAddresses = action.payload
            break

        case `${Actions.GET_TIME}_${FULFILLED}`:
            sportsOracle.time = action.payload
            break

        default:
            break
    }

    return sportsOracle
}

export default oracleReducer
