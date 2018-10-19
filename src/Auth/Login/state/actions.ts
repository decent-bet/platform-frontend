import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IKeyHandler } from '../../../common/types'
async function login(
    email: string,
    password: string,
    captchaKey: string,
    keyHandler: IKeyHandler
) {
    const data = { email, password, captchaKey }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/login', data)
            await keyHandler.setAuthToken(response.data.accessToken)
            resolve({
                activated: response.data.activated,
                message: response.data.message || 'Successfully logged in'
            })
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to login, please check later.'
            reject({ activated: false, message: errorMessage })
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.LOGIN]: login
    }
})
