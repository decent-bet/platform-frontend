import Actions, { PREFIX } from './actionTypes'
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
        case `${PREFIX}/${Actions.GET_PUBLIC_ADDRESS}/${FULFILLED}`:
            return {
                ...balanceState,
                address: action.payload
            }
        
        case `${PREFIX}/${Actions.GET_TOKENS}/${FULFILLED}`:
            return {
                ...balanceState,
                balance: action.payload
            }
        case `${PREFIX}/${Actions.GET_ETHER_BALANCE}/${FULFILLED}`:
            return {
                ...balanceState,
                etherBalance: action.payload
            }

        default:
            return { ...balanceState }
    }
}
