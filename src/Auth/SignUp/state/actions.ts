import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'

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
                reject('Password confirmation not valid')
                return
            }
            const response = await axios.post('/register', data)
            resolve(
                response.data.message || 'A new account created successfully'
            )
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to create a newe account, please check later.'
            reject(errorMessage)
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.SIGN_UP]: signUp
    }
})
