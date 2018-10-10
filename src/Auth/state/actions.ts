
import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import IKeyHandler from '../../common/helpers/IKeyHandler';

async function setRecaptchaKey(key: string) {
    return key
}

async function closeAlert() {
    return true
}

async function setSuccessMessage(message) {
    return message
}

async function activateAccount(id: string, key: string) {
    const data = { id, key }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/activate', data)
            resolve(response.data.message || 'Account activated.')
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error when trying to activate the account, please check later.'
            reject(errorMessage)
        }
    })
}


async function forgotPassword(email: string, captchaKey: string) {
    const data = { email, captchaKey }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/password/reset', data)
            resolve(response.data.message || 'Password recovery successfully requested.')
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error on password recovery request, please check later.'
            reject(errorMessage)
        }
    })
}


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
            resolve({activated: response.data.activated, message: response.data.message || 'Successfully logged in'})

        } catch (error) {
            let errorMessage = 
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to login, please check later.'
            reject({activated: false, message: errorMessage})
        }
    })
}

async function resetPassword(email: string, captchaKey: string, key: string) {
    const data = { email, captchaKey, key }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/password/reset/verify', data)
            resolve(response.data.message || 'Password reset success, please go to the login.')
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error on reset password request, please check later.'
            reject(errorMessage)
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
            const response = await axios.post('/register', data)
            resolve(response.data.message || 'A new account created successfully')
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to create a newe account, please check later.'
            reject(errorMessage)
        }
    })
}

function setRecaptchaInstance (recaptcha: React.RefObject<any>) {
    return Promise.resolve(recaptcha)
}

function setDefaultStatus() {
    return Promise.resolve(true)
}

export default createActions({
    [PREFIX]: {
        [Actions.SET_RECAPTCHA_KEY]: setRecaptchaKey,
        [Actions.SET_RECAPTCHA_INSTANCE]: setRecaptchaInstance,
        [Actions.CLOSE_ALERT]: closeAlert,
        [Actions.SET_SUCCESS_MESSAGE]: setSuccessMessage,
        [Actions.ACTIVATE_ACCOUNT]: activateAccount,
        [Actions.FORGOT_PASSWORD]: forgotPassword,
        [Actions.LOGIN]: login,
        [Actions.RESET_PASSWORD]: resetPassword,
        [Actions.SIGN_UP]: signUp,
        [Actions.SET_DEFAULT_STATUS]: setDefaultStatus
    }
})
