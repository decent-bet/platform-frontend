import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { AUTH_URL, AUTH_TOKEN_NAME } from '../../config'
import IKeyStore from '../../common/helpers/IKeyStore'

async function login(
    email: string,
    password: string,
    captchaKey: string,
    keysStore: IKeyStore
) {
    const data = { email, password, captchaKey }

    try {
        const response = await axios.post(`${AUTH_URL}/login`, data)
        if (response.data.activated !== true) {
            return Promise.reject(
                'Your account is not activated, please check your email to get the instructions.'
            )
        }

        await keysStore.addVariable(AUTH_TOKEN_NAME, response.data.accessToken)
        return response.data.message || 'Successfully logged in'
    } catch (error) {
        let errorMessage =
            error.response && error.response.data
                ? error.response.data.message
                : 'Error trying to login, please check later.'
        return Promise.reject(errorMessage)
    }
}


async function signUp(
    email: string,
    password: string,
    captchaKey: string,
    keysStore: IKeyStore
) {
    const data = { email, password, captchaKey }

    try {
        const response = await axios.post(`${AUTH_URL}/register`, data)
        return response.data.message || 'A new account created successfully'
    } catch (error) {
        let errorMessage =
            error.response && error.response.data
                ? error.response.data.message
                : 'Error trying to create a newe account, please check later.'
        return Promise.reject(errorMessage)
    }
}

async function logout(KeyStore: IKeyStore) {
    localStorage.clear()
    await KeyStore.clear()
}

async function closeAlert() {
    return Promise.resolve(true)
}

export default createActions({
    [PREFIX]: {
        [Actions.LOGIN]: login,
        [Actions.SIGN_UP]: signUp,
        [Actions.LOGOUT]: logout,
        [Actions.CLOSE_ALERT]: closeAlert
    }
})
