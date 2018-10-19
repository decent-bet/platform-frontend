import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    loading: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.LOGIN}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.LOGIN}/${FULFILLED}`:
        case `${PREFIX}/${Actions.LOGIN}/${REJECTED}`:
            return {
                ...state,
                loading: false
            }
        default:
            return { ...state }
    }
}
