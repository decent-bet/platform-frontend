import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import IKeyHandler from '../helpers/IKeyHandler'
import axios from 'axios'
import { AUTH_API_URL } from '../../config'

async function setUserAuthenticationStatus(keyHandler: IKeyHandler) {
    let token = await keyHandler.getAuthToken()
    return token !== null && token !== undefined
}

async function logout(keyHandler: IKeyHandler) {
    await keyHandler.clearStorage()
}

async function setHttpAuthBaseUrl() {
    axios.defaults.baseURL = AUTH_API_URL
    return AUTH_API_URL
}

async function setAccountIsActivated(activated: boolean, keyHandler: IKeyHandler) {
    await keyHandler.setAccountActivated(activated)
    return activated
}

export default createActions({
    [PREFIX]: {
        [Actions.LOGOUT]: logout,
        [Actions.SET_USER_AUTHENTICATION_STATUS]: setUserAuthenticationStatus,
        [Actions.SET_HTTP_AUTH_BASE_URL]: setHttpAuthBaseUrl,
        [Actions.SET_ACCOUNT_IS_ACTIVATED]: setAccountIsActivated
    }
})