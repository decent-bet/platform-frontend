import Actions, { Prefix } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultAuthState = {
    isLoggedIn: false,
    recaptchaKey: '',
    errorMessage: '',
    loading: false,
    alertIsOpen: false
}

export default function authReducer(
    authState = DefaultAuthState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.LOGIN}/${FULFILLED}`:
            return {
                ...authState,
                loading: false,
                isLoggedIn: action.payload
            }
        case `${Prefix}/${Actions.LOGIN}/${PENDING}`:
            return {
                ...authState,
                loading: true
        }
        case `${Prefix}/${Actions.LOGIN}/${REJECTED}`:
            let errorMessage = action.payload && 
                          action.payload.response && 
                          action.payload.response.data ? action.payload.response.data.message : 'Error trying to login, please check later.'
            
            return {
                ...authState,
                loading: false,
                alertIsOpen: true,
                errorMessage,
                isLoggedIn: false
        }
        case `${Prefix}/${Actions.CLOSE_ALERT}/${FULFILLED}`:
        return {
            ...authState,
            alertIsOpen: false,
            errorMessage: ''
    }
        case `${Prefix}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultAuthState
        default:
            return { ...authState }
    }
}
