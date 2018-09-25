import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { AUTH_TOKEN_NAME } from '../shared/config'
import IKeyStore from '../shared/helpers/IKeyStore'


async function userIsLoggedIn(KeyStore: IKeyStore) {
    let hasToken = await KeyStore.getVariable(AUTH_TOKEN_NAME)
    return hasToken !== null
}

async function logout(KeyStore: IKeyStore) {
    localStorage.clear()
    await KeyStore.clear()
}

export default createActions({
    [PREFIX]: {
        [Actions.LOGOUT]: logout,
        [Actions.USER_IS_LOGGEDIN]: userIsLoggedIn
    }
})