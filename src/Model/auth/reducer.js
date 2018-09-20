import Actions, { Prefix } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'
import { defaultStage } from '../../config'

const DefaultAuthState = {
    currentStage: defaultStage,
    isErrorDialogOpen: false
}

export default function authReducer(
    authState = DefaultAuthState,
    action = { type: null }
) {
    switch (action.type) {
        case `${Prefix}/${Actions.LOGIN}/${FULFILLED}`:
            return {
                ...authState,
                authStatus: action.payload
            }
        case `${Prefix}/${Actions.LOGOUT}/${FULFILLED}`:
            return {
                ...authState
            }
        case `${Prefix}/${Actions.GET_CURRENT_STAGE}/${FULFILLED}`:
            return {
                ...authState,
                currentStage: action.payload
            }
        case `${Prefix}/${Actions.SET_CURRENT_STAGE}/${FULFILLED}`:
            return {
                ...authState,
                currentStage: action.payload
            }
        default:
            return { ...authState }
    }
}
