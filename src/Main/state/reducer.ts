import Actions, { PREFIX } from './actionTypes'
import { FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    error: false,
    account: null,
    accountIsActivated: false,
    accountIsVerified: false,
    accountHasAddress: false,
    address: '0x'
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_PUBLIC_ADDRESS}/${FULFILLED}`:
            return {
                ...state,
                address: action.payload
            }
        case `${PREFIX}/${Actions.GET_ACCOUNT_ACTIVATION_STATUS}/${FULFILLED}`:
            return {
                ...state,
                accountIsActivated: action.payload
            }
        case `${PREFIX}/${Actions.GET_USER_ACCOUNT}/${FULFILLED}`:
            return {
                ...state,
                account: action.payload
            }
        case `${PREFIX}/${Actions.GET_USER_ACCOUNT}/${REJECTED}`:
            return {
                ...state,
                error: true,
                errorMessage: action.payload.message
            }
        case `${PREFIX}/${Actions.SET_ACCOUNT_HAS_ADDRESS}/${FULFILLED}`:
            return {
                ...state,
                accountHasAddress: action.payload
            }
        case `${PREFIX}/${Actions.SET_ACCOUNT_IS_VERIFIED}/${FULFILLED}`:
            return {
                ...state,
                accountIsVerified: action.payload
            }

        default:
            return { ...state }
    }
}
