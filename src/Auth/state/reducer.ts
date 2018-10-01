import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultAuthState = {
    isLoggedIn: false,
    recaptchaKey: '',
    errorMessage: '',
    alertType: 'error',
    loading: false,
    alertIsOpen: false
}

export default function authReducer(
    authState = DefaultAuthState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.LOGIN}/${FULFILLED}`:
        
            return {
                ...authState,
                loading: false,
                errorMessage: action.payload,
                isLoggedIn: true,
            }

        case `${PREFIX}/${Actions.LOGIN}/${PENDING}`:
            return {
                ...authState,
                loading: true
        }
        case `${PREFIX}/${Actions.LOGIN}/${REJECTED}`:
            
            return {
                ...authState,
                loading: false,
                alertIsOpen: true,
                errorMessage: action.payload,
                isLoggedIn: false
        }
        case `${PREFIX}/${Actions.CLOSE_ALERT}/${FULFILLED}`:
        return {
            ...authState,
            alertIsOpen: false,
            errorMessage: ''
    }
        case `${PREFIX}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultAuthState
        default:
            return { ...authState }
    }
}
