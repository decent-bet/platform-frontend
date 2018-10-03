import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import IKeyStore from '../../common/helpers/IKeyStore'

async function logout(KeyStore: IKeyStore) {
    localStorage.clear()
    await KeyStore.clear()
}

export default createActions({
    [PREFIX]: {
        [Actions.LOGOUT]: logout
    }
})
