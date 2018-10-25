import { AlertVariant } from './../components/Alert'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IKeyHandler } from '../types'

async function openAlert(message: string, variant: AlertVariant) {
    return { message: message || 'Sorry, an error occurred.', variant }
}

async function closeAlert() {
    return false
}

async function setAppLoaded() {
    return true
}

async function setUserAuthenticationStatus(keyHandler: IKeyHandler) {
    let token = await keyHandler.getAuthToken()
    return token !== null && token !== undefined
}

async function logout(keyHandler: IKeyHandler) {
    await keyHandler.clearStorage()
}

async function setAccountIsActivated(
    activated: boolean,
    keyHandler: IKeyHandler
) {
    await keyHandler.setAccountActivated(activated)
    return activated
}

export default createActions({
    [PREFIX]: {
        [Actions.APP_LOADED]: setAppLoaded,
        [Actions.OPEN_ALERT]: openAlert,
        [Actions.CLOSE_ALERT]: closeAlert,
        [Actions.LOGOUT]: logout,
        [Actions.SET_USER_AUTHENTICATION_STATUS]: setUserAuthenticationStatus,
        [Actions.SET_ACCOUNT_IS_ACTIVATED]: setAccountIsActivated
    }
})
