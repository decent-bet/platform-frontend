import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IAuthProvider } from '../../common/types'

/**
 * @param {string} email
 * @param {string} captchaKey
 */
async function forgotPassword(email: string, captchaKey: string) {
    const data = { email, captchaKey }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/password/reset/request', data)
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

async function signUp(
    email: string,
    password: string,
    passwordConfirmation: string,
    captchaKey: string
) {
    const data = { email, password, captchaKey }

    return new Promise(async (resolve, reject) => {
        try {
            if (password !== passwordConfirmation) {
                reject({ message: 'Password confirmation not valid' })
                return
            }
            const response = await axios.post('/register', data)
            if (response.data.error === true) {
                resolve({
                    message: response.data.message || 'An error ocurred.'
                })
            } else {
                resolve({
                    message:
                        'Account created, please check your email for your verification link to complete the registration process'
                })
            }
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to create a newe account, please check later.'
            reject({ message: errorMessage })
        }
    })
}

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
            reject({ message: errorMessage })
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

function login(
    email: string,
    password: string,
    captchaKey: string,
    authProvider: IAuthProvider
) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await authProvider.login(email, password, captchaKey)
            resolve(result)
        } catch (error) {
            let errorMessage
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                errorMessage = error.response.data.message
            } else if (error && error.message) {
                errorMessage = error.message
            } else {
                errorMessage = 'Error trying to login, please check later.'
            }
            reject({
                error,
                message: errorMessage
            })
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.LOGIN]: login,
        [Actions.SIGN_UP]: signUp,
        [Actions.FORGOT_PASSWORD]: forgotPassword,
        [Actions.RESET_PASSWORD_VERIFY]: resetPasswordVerify,
        [Actions.RESET_PASSWORD]: resetPassword
    }
})
