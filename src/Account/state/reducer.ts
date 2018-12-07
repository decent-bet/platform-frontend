import Actions, { PREFIX } from './actionTypes'
import { FULFILLED, PENDING } from 'redux-promise-middleware'

const DefaultState = {
    accountInfoSaved: false,
    accountAddressSaved: false,
    transactions: [],
    loading: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_INFO}/${PENDING}`:
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_ADDRESS}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_ADDRESS}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                accountInfoSaved: true
            }
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_INFO}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                accountAddressSaved: true
            }
        case `${PREFIX}/${Actions.GET_TRANSACTION_HISTORY}/${PENDING}`:
            return {
                ...state,
                loading: true,
                transactions: []
            }
        case `${PREFIX}/${Actions.GET_TRANSACTION_HISTORY}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                transactions: action.payload
            }
        default:
            return { ...state }
    }
}
