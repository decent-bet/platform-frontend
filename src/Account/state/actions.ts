import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import IKeyHandler from '../../common/helpers/IKeyHandler'
// import axios from 'axios'

function saveAccountInfo(keyHandler: IKeyHandler, formData: any): Promise<any> {
    return new Promise((resolve, reject) => {

    })
}

function saveAccountAddress(keyHandler: IKeyHandler, publicAddress: string, privateKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
        
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.SAVE_ACCOUNT_INFO]: saveAccountInfo,
        [Actions.SAVE_ACCOUNT_ADDRESS]: saveAccountAddress
    }
})
