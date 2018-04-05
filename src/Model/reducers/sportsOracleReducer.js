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
            return { ...sportsOracle, owner: action.payload }

        case `${Actions.GET_GAMES}_${FULFILLED}`:
            return { ...sportsOracle, games: action.payload }

        case `${Actions.GET_GAME_ITEM}_${FULFILLED}`:
            let game = action.payload
            let newGameArray = { ...sportsOracle.games, [game.id]: game }
            return { ...sportsOracle, games: newGameArray }

        case `${Actions.GET_GAME_UPDATE_COST}_${FULFILLED}`:
            let newPaymentObject = {
                ...sportsOracle.payments,
                gameUpdateCost: action.payload
            }
            return { ...sportsOracle, payments: newPaymentObject }

        case `${Actions.GET_REQUESTED_PROVIDER_ADDRESSES}_${FULFILLED}`:
            let newAddressObject1 = {
                ...sportsOracle.addresses,
                requestedProviderAddresses: action.payload
            }
            return { ...sportsOracle, addresses: newAddressObject1 }

        case `${Actions.GET_ACCEPTED_PROVIDER_ADDRESSES}_${FULFILLED}`:
            let newAddressObject2 = {
                ...sportsOracle.addresses,
                acceptedProviderAddresses: action.payload
            }
            return { ...sportsOracle, addresses: newAddressObject2 }

        case `${Actions.GET_TIME}_${FULFILLED}`:
        case Actions.SET_TIME:
            return { ...sportsOracle, time: action.payload }

        default:
            break
    }

    //Default: return object
    return sportsOracle
}

export default oracleReducer
