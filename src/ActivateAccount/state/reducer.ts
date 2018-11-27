import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    resultMessage: '',
    loading: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.ACTIVATE}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.ACTIVATE}/${REJECTED}`:
        case `${PREFIX}/${Actions.ACTIVATE}/${FULFILLED}`:
            return {
                ...state,
                resultMessage: action.payload.message,
                loading: false
            }
        default:
            return { ...state }
    }
}
