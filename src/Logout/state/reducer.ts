import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultState = {
    loading: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.LOGOUT}/${FULFILLED}`:
            return {
                loading: false
            }
        default:
            return { ...state }
    }
}
