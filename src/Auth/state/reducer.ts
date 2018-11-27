import Actions, { PREFIX } from './actionTypes'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const DefaultState = {
    forgotPassword: {
        processed: false,
        resultMessage: '',
        loading: false
    },
    login: {
        loading: false
    },
    passwordReset: {
        processed: false,
        resultMessage: '',
        loading: false
    },
    resetPassword: {
        verified: false,
        processed: false,
        resultMessage: '',
        loading: false
    },
    signUp: {
        processed: false,
        resultMessage: '',
        loading: false
    }
}

export default function reducer(
    state: any = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SIGN_UP}/${PENDING}`:
            return {
                ...state,
                signUp: { loading: true }
            }
        case `${PREFIX}/${Actions.SIGN_UP}/${REJECTED}`:
            return {
                ...state,
                signUp: {
                    loading: false,
                    processed: false
                }
            }
        case `${PREFIX}/${Actions.SIGN_UP}/${FULFILLED}`:
            return {
                ...state,
                signUp: {
                    loading: false,
                    processed: true,
                    resultMessage: action.payload.message
                }
            }
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${PENDING}`:
            return {
                ...state,
                forgotPassword: { loading: true }
            }
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${REJECTED}`:
        case `${PREFIX}/${Actions.FORGOT_PASSWORD}/${FULFILLED}`:
            return {
                ...state,
                forgotPassword: {
                    loading: false,
                    resultMessage: action.payload.message
                }
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${PENDING}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${PENDING}`:
            return {
                ...state,
                resetPassword: { loading: true }
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${FULFILLED}`:
            return {
                ...state,
                resetPassword: {
                    loading: false,
                    verified: true
                }
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD_VERIFY}/${REJECTED}`:
            return {
                ...state,
                resetPassword: {
                    loading: false,
                    verified: false,
                    resultMessage: action.payload.message
                }
            }
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${REJECTED}`:
        case `${PREFIX}/${Actions.RESET_PASSWORD}/${FULFILLED}`:
            return {
                ...state,
                resetPassword: {
                    loading: false,
                    processed: true,
                    resultMessage: action.payload.message
                }
            }
        case `${PREFIX}/${Actions.LOGIN}/${PENDING}`:
            return {
                ...state,
                login: { loading: true }
            }
        case `${PREFIX}/${Actions.LOGIN}/${FULFILLED}`:
        case `${PREFIX}/${Actions.LOGIN}/${REJECTED}`:
            return {
                ...state,
                login: {
                    loading: false
                }
            }
        default:
            return { ...state }
    }
}
