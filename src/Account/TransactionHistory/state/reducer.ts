import Actions, { PREFIX } from './actionTypes'
import { FULFILLED, PENDING } from 'redux-promise-middleware'

const DefaultState = {
    channels: [],
    details: {},
    currentIndex: 0,
    isLoading: false,
    itemsNotFound: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_CHANNELS_HISTORY}/${PENDING}`:
            return {
                ...state,
                isLoading: true
            }
        case `${PREFIX}/${Actions.GET_CHANNELS_HISTORY}/${FULFILLED}`:
            let result: any

            if (action.payload.currentIndex <= 0) {
                result = {
                    ...state,
                    details: {},
                    currentIndex: action.payload.currentIndex,
                    channels: [...action.payload.items],
                    isLoading: false,
                    itemsNotFound: action.payload.items.length <= 0
                }
            } else {
                result = {
                    ...state,
                    currentIndex: action.payload.currentIndex,
                    channels: [...state.channels, ...action.payload.items],
                    isLoading: false,
                    itemsNotFound: action.payload.items.length <= 0
                }
            }

            return result
        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${FULFILLED}`:
            return {
                ...state,
                details: {
                    ...state.details,
                    [action.payload.id]: action.payload.details
                }
            }
        default:
            return { ...state }
    }
}
