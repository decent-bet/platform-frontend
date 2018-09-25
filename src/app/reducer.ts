import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultAuthState = {
    isLoggedIn: false
}

export default function authReducer(
    appState = DefaultAuthState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.USER_IS_LOGGEDIN}/${FULFILLED}`:
            return {
                ...appState,
                isLoggedIn: action.payload
            }
        case `${PREFIX}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultAuthState
        default:
            return { ...appState }
    }
}
