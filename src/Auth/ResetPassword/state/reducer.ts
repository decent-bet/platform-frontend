import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultResetPasswordState = {
    recaptcha: null,
    recaptchaKey: '',
    resultMessage: '',
    loading: false
}

export default function authReducer(
    state = DefaultResetPasswordState,
    action: any = {}
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SET_RECAPTCHA_INSTANCE}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                recaptcha: action.payload
            }
        case `${PREFIX}/${Actions.SET_RECAPTCHA_KEY}/${FULFILLED}`:
            return {
                ...state,
                loading: false,
                recaptchaKey: action.payload
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${REJECTED}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${REJECTED}`:
            return {
                ...state,
                loading: false,
                resultMessage: action.payload.message
            }
        default:
            return { ...state }
    }
}
