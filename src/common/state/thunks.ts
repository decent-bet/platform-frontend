import Actions from './actions'
import { IThunkDependencies } from '../types'
import { AlertVariant } from '../components/Alert'
const actions: any = Actions.app

export function logout() {
    return async (
        dispatch,
        _getState,
        { authProvider }: IThunkDependencies
    ) => {
        return await dispatch(actions.logout(authProvider))
    }
}

export function setAppLoaded() {
    return async dispatch => {
        return await dispatch(actions.appLoaded())
    }
}

/**
 * Get the {ReplaceSubject<bool>} to subscribe for the authentication status
 * See {@link IAuthProvider} and [AuthProvider's authUser property] {@link IAuthProvider#authUser}
 */
export function getAuthenticationSubject() {
    return async (
        dispatch,
        _getState,
        { authProvider }: IThunkDependencies
    ) => {
        return await dispatch(actions.getAuthenticationSubject(authProvider))
    }
}

export function openAlert(message: string, variant: AlertVariant) {
    return async dispatch => {
        await dispatch(actions.openAlert(message, variant))
    }
}

export function checkLogin() {
    return async (
        dispatch,
        _getState,
        { authProvider }: IThunkDependencies
    ) => {
        return await dispatch(actions.checkLogin(authProvider))
    }
}

export function closeAlert() {
    return async dispatch => {
        await dispatch(actions.closeAlert())
    }
}
