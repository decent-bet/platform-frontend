import Actions, { Prefix } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultAuthState = {
    isLoggedIn: false,
    recaptchaKey: '',
    errorMessage: '',
    loading: false,
    isErrorDialogOpen: false
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
            return {
                ...authState,
                loading: false,
                errorMessage: action.payload.message,
                isLoggedIn: false
        }
        case `${Prefix}/${Actions.SET_RECAPTCHA_KEY}/${FULFILLED}`:
            return {
                ...authState,
                recaptchaKey: action.payload
        }
        case `${Prefix}/${Actions.LOGOUT}/${FULFILLED}`:
            return DefaultAuthState
        default:
            return { ...authState }
    }
}
