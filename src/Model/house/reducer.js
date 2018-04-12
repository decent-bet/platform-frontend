import Actions, { Prefix } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const defaultHouseState = {
    credits: {},
    authorizedAddresses: [],
    sessionId: -1,
    sessionState: {},
    allowance: 0
}

export default function houseReducer(
    houseState = defaultHouseState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.GET_HOUSE_SESSION_ID}/${FULFILLED}`:
            return { ...houseState, sessionId: action.payload }

        case `${Prefix}/${Actions.GET_HOUSE_SESSION_DATA}/${FULFILLED}`:
            return { ...houseState, sessionState: action.payload }

        case `${Prefix}/${Actions.GET_HOUSE_AUTHORIZED_ADDRESSES}/${FULFILLED}`:
            return { ...houseState, authorizedAddresses: action.payload }

        case `${Prefix}/${Actions.GET_HOUSE_ALLOWANCE}/${FULFILLED}`:
            return { ...houseState, allowance: action.payload }

        case `${Prefix}/${Actions.SET_HOUSE_PURCHASED_CREDITS}/${FULFILLED}`:
            let { sessionNumber, credits } = this.payload
            return {
                ...houseState,
                credits: { ...houseState.credits, [sessionNumber]: credits }
            }

        default:
            return {...houseState}
    }
}
