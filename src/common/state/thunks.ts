import Actions from './actions'
import { IThunkDependencies } from '../types'
import { AlertVariant } from '../components/Alert'
const actions: any = Actions.app

export function logout() {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        return await dispatch(actions.logout(keyHandler))
    }
}

export function setUserAuthenticationStatus() {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        await dispatch(actions.setUserAuthenticationStatus(keyHandler))
    }
}

export function setAccountIsActivated(activated: boolean) {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        await dispatch(actions.setAccountIsActivated(activated, keyHandler))
    }
}

export function setHttpAuthHeader() {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        await dispatch(actions.setHttpAuthHeader(keyHandler))
    }
}

export function setHttpAuthBaseUrl() {
    return async dispatch => {
        await dispatch(actions.setHttpAuthBaseUrl())
    }
}

export function openAlert(message: string, variant: AlertVariant) {
    return async dispatch => {
        await dispatch(actions.openAlert(message, variant))
    }
}

export function closeAlert() {
    return async dispatch => {
        await dispatch(actions.closeAlert())
    }
}
