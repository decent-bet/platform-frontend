import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'

/**
 * @param {string} email
 * @param {string} captchaKey
 */
async function forgotPassword(email: string, captchaKey: string) {
    const data = { email, captchaKey }
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
        [Actions.FORGOT_PASSWORD]: forgotPassword
    }
})
