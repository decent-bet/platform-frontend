import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultMainState = {
    isLoggedIn: false
}

export default function reducer(
    mainState = DefaultMainState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.USER_IS_LOGGEDIN}/${FULFILLED}`:
            return {
                ...mainState,
                isLoggedIn: action.payload
            }
        case `${PREFIX}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultMainState
        default:
            return { ...mainState }
    }
}
