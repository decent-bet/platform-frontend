import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { AUTH_TOKEN_NAME } from '../../config'
import IKeyStore from '../../common/helpers/IKeyStore'


async function userIsLoggedIn(KeyStore: IKeyStore) {
    let token = await KeyStore.getVariable(AUTH_TOKEN_NAME)
    return token !== null && token !== undefined
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