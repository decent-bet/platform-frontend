import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import IKeyHandler from '../../common/helpers/IKeyHandler'

async function logout(keyHandler: IKeyHandler) {
    localStorage.clear()
    await keyHandler.clearStorage()
}

export default createActions({
    [PREFIX]: {
        [Actions.LOGOUT]: logout
    }
})
