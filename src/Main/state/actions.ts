import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IKeyHandler } from '../../common/types'
import axios from 'axios'

function setHttpAuthHeader(keyHandler: IKeyHandler): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const token = await keyHandler.getAuthToken()
        if (token) {
            axios.defaults.headers.authorization = `Bearer ${token}`
            resolve('OK')
        } else {
            reject('Token not found')
        }
    })
}

async function fetchPublicAddress(keyHandler: IKeyHandler): Promise<any> {
    return keyHandler.getPublicAddress()
}

function getUserAccount(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get('/user')
            resolve(response.data.user)
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to get the user account, please check later.'
            reject({ message: errorMessage })
        }
    })
}

async function setAccountHasAddress(account: any): Promise<boolean> {
    return (
        account &&
        account.verification &&
        account.verification.addressRegistration &&
        account.verification.addressRegistration.vetAddress !== null
    )
}

async function setAccountIsVerified(account: any): Promise<boolean> {
    return (
        account &&
        account.verification &&
        account.verification.basicVerification &&
        account.verification.basicVerification.verified === true
    )
}

async function getAccountActivationStatus(
    keyHandler: IKeyHandler
): Promise<boolean> {
    const status = await keyHandler.getAccountActivationStatus()
    if (status) {
        return status
    }

    return false
}

export default createActions({
    [PREFIX]: {
        [Actions.SET_HTTP_AUTH_HEADER]: setHttpAuthHeader,
        [Actions.GET_PUBLIC_ADDRESS]: fetchPublicAddress,
        [Actions.GET_USER_ACCOUNT]: getUserAccount,
        [Actions.SET_ACCOUNT_HAS_ADDRESS]: setAccountHasAddress,
        [Actions.SET_ACCOUNT_IS_VERIFIED]: setAccountIsVerified,
        [Actions.GET_ACCOUNT_ACTIVATION_STATUS]: getAccountActivationStatus
    }
})
