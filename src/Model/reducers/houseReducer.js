import { HouseActions as Actions } from '../actionTypes'
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
        case `${Actions.GET_HOUSE_SESSION_ID}_${FULFILLED}`:
            return { ...houseState, sessionId: action.payload }

        case `${Actions.GET_HOUSE_SESSION_DATA}_${FULFILLED}`:
            return { ...houseState, sessionState: action.payload }

        case `${Actions.GET_HOUSE_AUTHORIZED_ADDRESSES}_${FULFILLED}`:
            return { ...houseState, authorizedAddresses: action.payload }

        case `${Actions.GET_HOUSE_ALLOWANCE}_${FULFILLED}`:
            return { ...houseState, allowance: action.payload }

        case `${Actions.SET_HOUSE_PURCHASED_CREDITS}_${FULFILLED}`:
            let { sessionNumber, credits } = this.payload
            return {
                ...houseState,
                credits: { ...houseState.credits, [sessionNumber]: credits }
            }

        default:
            break
    }
    return houseState
}
