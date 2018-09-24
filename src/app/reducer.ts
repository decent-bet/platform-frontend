import Actions, { Prefix } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultAuthState = {
    isLoggedIn: false
}

export default function authReducer(
    appState = DefaultAuthState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.USER_IS_LOGGEDIN}/${FULFILLED}`:
            return {
                ...appState,
                isLoggedIn: action.payload
            }
        case `${Prefix}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultAuthState
        default:
            return { ...appState }
    }
}
