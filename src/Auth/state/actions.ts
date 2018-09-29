import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import { AUTH_URL, AUTH_TOKEN_NAME } from '../../config'
import IKeyStore from '../../common/helpers/IKeyStore'

async function login(email: string, password: string, captchaKey: string, keysStore: IKeyStore) {
    const data = {email, password, captchaKey}
    const response = await axios.post(`${AUTH_URL}/login`, data)
    await keysStore.addVariable(AUTH_TOKEN_NAME, response.data.accessToken)
    return { susscess: true, message: response.data.message || 'Successfully logged in'}
}

async function logout(KeyStore: IKeyStore) {
    localStorage.clear()
    await KeyStore.clear()
}

async function closeAlert() {
    return Promise.resolve(true)
}


export default createActions({
    [Prefix]: {
        [Actions.LOGIN]: login,
        [Actions.LOGOUT]: logout,
        [Actions.CLOSE_ALERT]: closeAlert
    }
})