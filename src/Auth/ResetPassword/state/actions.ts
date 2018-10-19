import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'

async function resetPasswordVerify(id: string, key: string) {
    const data = { id, key }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/password/reset/verify', data)
            resolve(response.data)
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error on password recovery request, please check later.'
            reject(errorMessage)
        }
    })
}

/**
 *
 * @param {string} id
 * @param {string} key
 * @param {string} password
 * @param {string} _captchaKey
 */
async function resetPassword(
    id: string,
    key: string,
    password: string,
    _captchaKey: string
) {
    const data = { id, key, password }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/password/reset', data)
            resolve({
                message:
                    response.data.message ||
                    'Password reset success, please go to the login.'
            })
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error on reset password request, please check later.'
            reject({ message: errorMessage })
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.RESET_PASSWORD_VERIFY]: resetPasswordVerify,
        [Actions.RESET_PASSWORD]: resetPassword
    }
})
