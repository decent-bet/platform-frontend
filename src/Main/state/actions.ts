import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import BigNumber from 'bignumber.js'
import { units } from 'ethereum-units'
import IKeyHandler from '../../common/helpers/IKeyHandler'
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

// Get Total Ether.
export async function fetchEtherBalance(
    contractFactory,
    keyHandler: IKeyHandler
): Promise<any> {
    let address = keyHandler.getPublicAddress()
    let contract = await contractFactory.decentBetTokenContract()
    let rawAmount = await contract.getBalance(address)
    let balance = new BigNumber(rawAmount).dividedBy(units.ether)
    return balance
}

function getUserAccount(_keyHandler: IKeyHandler): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            // const response =
            await axios.get('/user')
            const user = {
                email: 'bradley.suira@gmail.com',
                verification: {
                    addressRegistration: {
                        vetAddress:
                            '0x98a57d8482f4b06adD470450E57B84c734F9F488',
                        approvalId: '12345678',
                        sign: {
                            signature: '12345',
                            v: '12345',
                            r: '12345',
                            s: '12345'
                        }
                    },
                    basicVerification: {
                        firstName: 'Bradley',
                        middleName: 'S.',
                        lastName: 'Suira',
                        sex: 'Male',
                        dob: '12-03-1984',
                        country: 'Panama',
                        state: 'Panama',
                        streetAddress: 'Panama',
                        phoneNumber: '507 63494308',
                        postCode: '507',
                        town: 'Panama',
                        verified: true
                    }
                }
            }

            resolve(user)
            // resolve(response.data.user)
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to get the user account, please check later.'
            reject(errorMessage)
        }
    })
}

async function setAccountHasAddress(account: any): Promise<boolean> {
    if (
        account &&
        account.verification &&
        account.verification.addressRegistration &&
        account.verification.addressRegistration.vetAddress !== null
    ) {
        return true
    }

    return false
}

async function setAccountIsVerified(account: any): Promise<boolean> {
    if (
        account &&
        account.verification &&
        account.verification.basicVerification &&
        account.verification.basicVerification.verified === true
    ) {
        return true
    }

    return false
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
