import Actions, { Prefix } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultAuthState = {
    provider: '',
    isErrorDialogOpen: false
}

export default function authReducer(
    authState = DefaultAuthState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.LOGIN}/${FULFILLED}`:
            return {
                ...authState,
                authStatus: action.payload
            }
        case `${Prefix}/${Actions.LOGOUT}/${FULFILLED}`:
            return {
                ...authState
            }
        case `${Prefix}/${Actions.GET_PROVIDER_URL}/${FULFILLED}`:
            return {
                ...authState,
                provider: action.payload
            }
        default:
            return { ...authState }
    }
}
