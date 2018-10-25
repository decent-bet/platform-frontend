import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'

async function activateAccount(id: string, key: string) {
    const data = { id, key }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/activate', data)
            resolve({ message: response.data.message || 'Account activated.' })
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error when trying to activate the account, please check later.'
            reject({ message: errorMessage })
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.ACTIVATE]: activateAccount
    }
})
