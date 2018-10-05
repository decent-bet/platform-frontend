import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultMainState = {
    userIsAuthenticated: false
}

export default function reducer(
    mainState = DefaultMainState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SET_USER_AUTHENTICATION_STATUS}/${FULFILLED}`:
            return {
                ...mainState,
                userIsAuthenticated: action.payload
            }
        case `${PREFIX}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultMainState
        default:
            return { ...mainState }
    }
}
