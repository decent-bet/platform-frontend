import { ReplaySubject } from 'rxjs'
import { IAuthProvider } from 'src/common/types'
import { AlertVariant } from './../components/Alert'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'

async function openAlert(message: string, variant: AlertVariant) {
    return { message: message || 'Sorry, an error occurred.', variant }
}

async function closeAlert() {
    return false
}

async function setAppLoaded() {
    return true
}

async function getAuthenticationSubject(
    authProvider: IAuthProvider
): Promise<ReplaySubject<any>> {
    return authProvider.authUser
}

async function logout(authProvider: IAuthProvider) {
    await authProvider.logout()
}

async function checkLogin(authProvider: IAuthProvider) {
    authProvider.checkLogin()
}

export default createActions({
    [PREFIX]: {
        [Actions.APP_LOADED]: setAppLoaded,
        [Actions.OPEN_ALERT]: openAlert,
        [Actions.CLOSE_ALERT]: closeAlert,
        [Actions.LOGOUT]: logout,
        [Actions.GET_AUTHENTICATION_SUBJECT]: getAuthenticationSubject,
        [Actions.CHECK_LOGIN]: checkLogin
    }
})
