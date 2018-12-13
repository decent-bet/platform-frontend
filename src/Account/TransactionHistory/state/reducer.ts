import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultState = {
    channels: []
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_CHANNELS_HISTORY}/${FULFILLED}`:
            if (state.channels.length > 0) {
                return {
                    ...state,
                    loading: false,
                    channels: [...state.channels, ...action.payload]
                }
            }
            return {
                ...state,
                loading: false,
                channels: action.payload
            }
        default:
            return { ...state }
    }
}
