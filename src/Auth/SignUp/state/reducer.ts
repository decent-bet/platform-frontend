import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    processed: false,
    resultMessage: '',
    loading: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SIGN_UP}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.SIGN_UP}/${REJECTED}`:
        case `${PREFIX}/${Actions.SIGN_UP}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                processed: true,
                resultMessage: action.payload.message
            }
        default:
            return { ...state }
    }
}
