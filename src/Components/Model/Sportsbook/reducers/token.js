import { BalanceActions as Actions } from '../actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

export default function tokenActions(tokenState = {}, action = { type: null }) {
    switch (action.type) {
        case `${Actions.GET_TOKENS}_${FULFILLED}`:
            tokenState.balance = action.payload
            break

        default:
            break
    }
    return tokenState
}
