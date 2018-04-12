import Actions, { Prefix } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultBalanceState = {
    balance: 0,
    etherBalance: 0,
    address: '0x'
}

export default function balanceReducer(
    balanceState = DefaultBalanceState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.GET_PUBLIC_ADDRESS}/${FULFILLED}`:
            return {
                ...balanceState,
                address: action.payload
            }
        case `${Prefix}/${Actions.GET_TOKENS}/${FULFILLED}`:
            return {
                ...balanceState,
                balance: action.payload
            }
        case `${Prefix}/${Actions.GET_ETHER_BALANCE}/${FULFILLED}`:
            return {
                ...balanceState,
                etherBalance: action.payload
            }

        default:
            return { ...balanceState }
    }
}
