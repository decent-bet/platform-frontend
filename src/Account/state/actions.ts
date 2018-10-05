import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import IKeyHandler from '../../common/helpers/IKeyHandler'
// import axios from 'axios'

async function saveAccountInfo(keyHandler: IKeyHandler) {
    return Promise.resolve()
}

async function saveAccountAddress(keyHandler: IKeyHandler) {
    return Promise.resolve()
}

export default createActions({
    [PREFIX]: {
        [Actions.SAVE_ACCOUNT_INFO]: saveAccountInfo,
        [Actions.SAVE_ACCOUNT_ADDRESS]: saveAccountAddress
    }
})
