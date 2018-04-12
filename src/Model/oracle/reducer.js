import Actions, { Prefix } from './actionTypes'
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

export default function oracleReducer(
    sportsOracle = DefaultOracleState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.GET_OWNER}/${FULFILLED}`:
            return { ...sportsOracle, owner: action.payload }

        case `${Prefix}/${Actions.GET_GAMES}/${FULFILLED}`:
            return { ...sportsOracle, games: action.payload }

        case `${Prefix}/${Actions.GET_GAME_ITEM}/${FULFILLED}`:
            let game = action.payload
            let newGameArray = { ...sportsOracle.games, [game.id]: game }
            return { ...sportsOracle, games: newGameArray }

        case `${Prefix}/${Actions.GET_GAME_UPDATE_COST}/${FULFILLED}`:
            let newPaymentObject = {
                ...sportsOracle.payments,
                gameUpdateCost: action.payload
            }
            return { ...sportsOracle, payments: newPaymentObject }

        case `${Prefix}/${Actions.GET_REQUESTED_PROVIDER_ADDRESSES}/${FULFILLED}`:
            let newAddressObject1 = {
                ...sportsOracle.addresses,
                requestedProviderAddresses: action.payload
            }
            return { ...sportsOracle, addresses: newAddressObject1 }

        case `${Prefix}/${Actions.GET_ACCEPTED_PROVIDER_ADDRESSES}/${FULFILLED}`:
            let newAddressObject2 = {
                ...sportsOracle.addresses,
                acceptedProviderAddresses: action.payload
            }
            return { ...sportsOracle, addresses: newAddressObject2 }

        case `${Prefix}/${Actions.GET_TIME}/${FULFILLED}`:
        case `${Prefix}/${Actions.SET_TIME}`:
            return { ...sportsOracle, time: action.payload }

        //Default: return object
        default:
            return { ...sportsOracle}
    }
}
