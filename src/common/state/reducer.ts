import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultMainState = {
    alertIsOpen: false,
    alertType: 'error',
    alertMessage: '',
    userIsAuthenticated: false
}

export default function reducer(
    mainState = DefaultMainState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.OPEN_ALERT}/${FULFILLED}`:
            return {
                ...mainState,
                alertIsOpen: true,
                alertType: action.payload.type || 'error',
                alertMessage: action.payload.message
            }
        case `${PREFIX}/${Actions.CLOSE_ALERT}/${FULFILLED}`:
            return {
                ...mainState,
                alertIsOpen: false,
                alertMessage: ''
            }
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
