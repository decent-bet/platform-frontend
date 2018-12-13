import Actions, { PREFIX } from './actionTypes'
import { FULFILLED, PENDING } from 'redux-promise-middleware'

const DefaultState = {
    details: {},
    loading: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                details: action.payload
            }

        default:
            return { ...state }
    }
}
