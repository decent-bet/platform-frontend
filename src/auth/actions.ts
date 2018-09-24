import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import { getAuthUrl, AUTH_TOKEN_NAME } from '../shared/config'
import IKeyStore from '../shared/helpers/IKeyStore'

async function login(email: string, password: string, captchaKey: string, KeyStore: IKeyStore) {
    const baseUrl = getAuthUrl()
    const data = {email, password, captchaKey}

    try {
        const response = await axios.post(`${baseUrl}/login`, data)
        switch (response.status) {
            case 200:
            return true
            case 401:
            return 'incorrect email or password'
            default:
            return 'Error trying to login, please check later.'
        }
    } catch (error) {
        return error.message
    }
}

async function logout(KeyStore: IKeyStore) {
    localStorage.clear()
    await KeyStore.clear()
}

async function isLoggedIn(KeyStore: IKeyStore) {
    let hasToken = await KeyStore.getVariable(AUTH_TOKEN_NAME)
    return hasToken !== null
}

async function setRecaptchaKey(key) {

}

export default createActions({
    [Prefix]: {
        [Actions.LOGIN]: login,
        [Actions.LOGOUT]: logout,
        [Actions.IS_LOGGEDIN]: isLoggedIn,
        [Actions.SET_RECAPTCHA_KEY]: setRecaptchaKey
    }
})