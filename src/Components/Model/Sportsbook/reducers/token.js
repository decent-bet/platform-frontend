import { BalanceActions as Actions } from '../actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultTokenState = {
    balance: 0
}

export default function tokenActions(tokenState = DefaultTokenState, action = { type: null }) {
    switch (action.type) {
        case `${Actions.GET_TOKENS}_${FULFILLED}`:
            tokenState.balance = action.payload
            break

        default:
            break
    }
    return tokenState
}
