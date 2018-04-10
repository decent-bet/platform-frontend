import { BalanceActions as Actions } from '../actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultTokenState = {
    balance: 0,
    address: '0x'
}

export default function tokenActions(
    tokenState = DefaultTokenState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Actions.GET_PUBLIC_ADDRESS}_${FULFILLED}`:
            return {
                ...tokenState,
                address: action.payload
            }
        case `${Actions.GET_TOKENS}_${FULFILLED}`:
            return {
                ...tokenState,
                balance: action.payload
            }

        default:
            break
    }

    // return old state
    return tokenState
}
