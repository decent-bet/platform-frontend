import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultMainState = {
    account: null,
    accountIsActivated: false,
    accountIsVerified: false,
    accountHasAddress: false,
    balance: 0,
    etherBalance: 0,
    address: '0x'
}

export default function reducer(
    mainState = DefaultMainState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_PUBLIC_ADDRESS}/${FULFILLED}`:
            return {
                ...mainState,
                address: action.payload
            }
        
        case `${PREFIX}/${Actions.GET_TOKENS}/${FULFILLED}`:
            return {
                ...mainState,
                balance: action.payload
            }
        case `${PREFIX}/${Actions.GET_ACCOUNT_ACTIVATION_STATUS}/${FULFILLED}`:
            return {
                ...mainState,
                accountIsActivated: action.payload
        }
        case `${PREFIX}/${Actions.GET_USER_ACCOUNT}/${FULFILLED}`:
            return {
                ...mainState,
                account: action.payload
        }
        case `${PREFIX}/${Actions.SET_ACCOUNT_HAS_ADDRESS}/${FULFILLED}`:
            return {
                ...mainState,
                accountHasAddress: action.payload
        }
        case `${PREFIX}/${Actions.SET_ACCOUNT_IS_VERIFIED}/${FULFILLED}`:
            return {
                ...mainState,
                accountIsVerified: action.payload
        }
        case `${PREFIX}/${Actions.GET_ETHER_BALANCE}/${FULFILLED}`:
            return {
                ...mainState,
                etherBalance: action.payload
            }

        default:
            return { ...mainState }
    }
}
