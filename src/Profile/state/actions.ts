import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import IKeyHandler from '../../common/helpers/IKeyHandler'
// import axios from 'axios'

async function saveUserProfile(keyHandler: IKeyHandler) {
    return Promise.resolve()
}

export default createActions({
    [PREFIX]: {
        [Actions.SAVE_USER_PROFILE]: saveUserProfile
    }
})
