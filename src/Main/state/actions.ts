import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import BigNumber from 'bignumber.js'
import { units } from 'ethereum-units'
import IKeyHandler from '../../common/helpers/IKeyHandler'
import axios from 'axios'


export async function setHttpAuthHeader(keyHandler: IKeyHandler) {
    return new Promise(async (resolve, reject) => {
        const token = await keyHandler.getAuthToken()
        if(token) {
            axios.defaults.headers.authorization = `Bearer ${token}`
            resolve('OK')
        }else {
            reject('Token not found')
        }
    })
}

export async function fetchTokens(contractFactory, keyHandler: IKeyHandler) {
        let address = keyHandler.getPublicAddress()
        let contract = await contractFactory.decentBetTokenContract()

        let rawResult = await contract.balanceOf(address)
        let tokens = new BigNumber(rawResult)
                                .dividedBy(units.ether)
                                .toNumber()
        return tokens
}

export async function fetchPublicAddress(keyHandler: IKeyHandler) {
    return keyHandler.getPublicAddress()
}

export async function faucet(contractFactory) {
    let contract = await contractFactory.decentBetTokenContract()
        let tx = await contract.faucet()
        return tx
}

// Get Total Ether.
export async function fetchEtherBalance(contractFactory, keyHandler: IKeyHandler) {
        let address = keyHandler.getPublicAddress()
        let contract = await contractFactory.decentBetTokenContract()
        let rawAmount = await contract.getBalance(address)
        let balance = new BigNumber(rawAmount).dividedBy(units.ether)
        return balance
}


export async function getUserProfile(keyHandler: IKeyHandler) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get('/user')
            resolve(response.data.user)
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying to get the user profile, please check later.'
            reject(errorMessage)
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.SET_HTTP_AUTH_HEADER]: setHttpAuthHeader,
        [Actions.GET_PUBLIC_ADDRESS]: fetchPublicAddress,
        [Actions.GET_TOKENS]: fetchTokens,
        [Actions.GET_ETHER_BALANCE]: fetchEtherBalance,
        [Actions.FAUCET]: faucet,
        [Actions.GET_USER_PROFILE]: getUserProfile
    }
})
