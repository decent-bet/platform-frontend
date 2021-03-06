import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultAppState = {
    alertIsOpen: false,
    alertType: 'error',
    channelBackendError: null,
    channelBackendErrorIsOpen: false,
    alertMessage: ''
}

export default function reducer(
    state = DefaultAppState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.OPEN_ALERT}/${FULFILLED}`:
            if (state.alertIsOpen) {
                return {
                    ...state
                }
            }
            return {
                ...state,
                alertIsOpen: true,
                alertType: action.payload.variant || 'error',
                alertMessage: action.payload.message
            }
        case `${PREFIX}/${Actions.CLOSE_ALERT}/${FULFILLED}`:
            return {
                ...state,
                alertIsOpen: false,
                alertMessage: ''
            }
        case `${PREFIX}/${Actions.SHOW_CHANNELS_BACKEND_ERROR}/${FULFILLED}`:
            const { payload } = action
            const { channelBackendError } = state

            if (
                payload &&
                channelBackendError &&
                (channelBackendError as any).statusCode === payload.statusCode
            ) {
                return {
                    ...state
                }
            }
            return {
                ...state,
                channelBackendErrorIsOpen: true,
                channelBackendError: payload
            }
        case `${PREFIX}/${Actions.HIDE_CHANNELS_BACKEND_ERROR}/${FULFILLED}`:
            return {
                ...state,
                channelBackendErrorIsOpen: false,
                channelBackendError: null
            }
        case `${PREFIX}/${Actions.GET_AUTHENTICATION_SUBJECT}/${FULFILLED}`:
            return {
                ...state
            }
        case `${PREFIX}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultAppState
        default:
            return { ...state }
    }
}
