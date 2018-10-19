import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    resultMessage: '',
    loading: false,
    processed: false
}

export default function authReducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.ACTIVATE_ACCOUNT}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.ACTIVATE_ACCOUNT}/${REJECTED}`:
        case `${PREFIX}/${Actions.ACTIVATE_ACCOUNT}/${FULFILLED}`:
            return {
                ...state,
                resultMessage: action.payload.message,
                loading: false,
                processed: true
            }
        default:
            return { ...state }
    }
}
