import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultAuthState = {
    recaptcha: null,
    recaptchaKey: '',
    resultMessage: '',
    loading: false,
    processed: false
}

export default function authReducer(
    authState = DefaultAuthState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SET_RECAPTCHA_KEY}/${FULFILLED}`:
            return {
                ...authState,
                loading: false,
                recaptchaKey: action.payload
            }
        case `${PREFIX}/${Actions.SET_RECAPTCHA_INSTANCE}/${FULFILLED}`:
            return {
                ...authState,
                loading: false,
                recaptcha: action.payload
            }
        case `${PREFIX}/${Actions.LOGIN}/${PENDING}`:
        case `${PREFIX}/${Actions.SIGN_UP}/${PENDING}`:
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${PENDING}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${PENDING}`:
        case `${PREFIX}/${Actions.ACTIVATE_ACCOUNT}/${PENDING}`:
            return {
                ...authState,
                loading: true
            }
        case `${PREFIX}/${Actions.ACTIVATE_ACCOUNT}/${REJECTED}`:
            return {
                ...authState,
                processed: true,
                resultMessage: action.payload
            }
        case `${PREFIX}/${Actions.LOGIN}/${FULFILLED}`:
        case `${PREFIX}/${Actions.SIGN_UP}/${FULFILLED}`:
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${FULFILLED}`:
        case `${PREFIX}/${Actions.ACTIVATE_ACCOUNT}/${FULFILLED}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${FULFILLED}`:
            return {
                ...authState,
                loading: false,
                processed: true,
                recaptchaKey: '',
                recaptcha: null
            }
        case `${PREFIX}/${Actions.SIGN_UP}/${REJECTED}`:
            return {
                ...authState,
                loading: false,
                processed: false
            }
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${REJECTED}`:
        case `${PREFIX}/${Actions.LOGIN}/${REJECTED}`:
            return {
                ...authState,
                loading: false
            }
        case `${PREFIX}/${Actions.SET_DEFAULT_STATUS}/${FULFILLED}`:
            return DefaultAuthState
        default:
            return { ...authState }
    }
}