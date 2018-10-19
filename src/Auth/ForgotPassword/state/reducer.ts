import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    processed: false,
    resultMessage: '',
    loading: false
}

export default function reducer(state = DefaultState, action: any = {}) {
    switch (action.type) {
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${REJECTED}`:
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                resultMessage: action.payload.message
            }
        default:
            return { ...state }
    }
}
