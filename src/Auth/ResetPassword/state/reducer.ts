import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    processed: false,
    resultMessage: '',
    loading: false
}

export default function reducer(state = DefaultState, action: any = {}) {
    switch (action.type) {
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${PENDING}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${REJECTED}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${REJECTED}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${FULFILLED}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${FULFILLED}`:
            return {
                ...state,
                processed: true,
                loading: false,
                resultMessage: action.payload.message
            }
        default:
            return { ...state }
    }
}
