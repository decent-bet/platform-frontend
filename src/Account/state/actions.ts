import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IKeyHandler, IContractFactory } from '../../common/types'
import { Observable } from 'rxjs'
import { tap, map } from 'rxjs/operators'

function saveAccountInfo(formData: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/verification/basic', formData)
            resolve(response.data)
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : 'Error trying save the account info, please check later.'
            reject({ message: errorMessage })
        }
    })
}

function saveAccountAddress(
    account: any,
    publicAddress: string,
    privateKey: string,
    keyHandler: IKeyHandler,
    thorify: any
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { approvalId } = account.verification.addressRegistration
            const sign = thorify.eth.accounts.sign(approvalId, privateKey)

            const recovered = thorify.eth.accounts.recover(
                approvalId,
                sign.signature
            )

            if (thorify.utils.toChecksumAddress(recovered) !== publicAddress) {
                reject({
                    message: `The private key provided doesn't correspond to the public address`
                })
            } else {
                const data = {
                    address: publicAddress,
                    signature: sign.signature
                }

                const response = await axios.post('/registration/address', data)
                keyHandler.storeTempPrivateKey(privateKey)
                resolve(response.data)
            }
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message // 'Error trying save your VET address, please check later.'
            reject({ message: errorMessage })
        }
    })
}

function requestActivationEmail(): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('/activate/request')
            resolve(response.data)
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message // 'Error trying save your VET address, please check later.'
            reject({ message: errorMessage })
        }
    })
}

function getTransactionHistory(
    contractFactory: IContractFactory,
    address: string
) {
    return new Promise(async (resolve, reject) => {
        const topRequests = 3
        let totalRequests = 0

        try {
            const slotsChannelManagerContract = await contractFactory.slotsChannelManagerContract(
                address
            )

            // start session => LogNewChannel
            const LogNewChannel$ = slotsChannelManagerContract.getEventSubscription(
                slotsChannelManagerContract.getChannels()
            )

            // end session => LogChannelFinalized
            const logChannelFinalized$ = slotsChannelManagerContract.getEventSubscription(
                slotsChannelManagerContract.logChannelFinalized()
            )

            // claim => LogClaimChannelTokens

            const LogClaimChannelTokens$ = slotsChannelManagerContract.getEventSubscription(
                slotsChannelManagerContract.getChannels()
            )

            // ----> get finalBalances after claim

            const channels$: Observable<any> = LogNewChannel$.pipe(
                tap(() => {
                    totalRequests++
                }),
                map((i: any) => {
                    return i.map(event => {
                        const { returnValues } = event
                        const {
                            id,
                            channelNonce,
                            initialDeposit,
                            timestamp
                        } = returnValues
                        return { id, channelNonce, initialDeposit, timestamp }
                    })
                })
            )

            const subs = channels$.subscribe(
                async items => {
                    if (items.length > 0 || totalRequests >= topRequests) {
                        subs.unsubscribe() // stop making requests
                        resolve(items)
                    }
                },
                error => {
                    console.error(error)
                    reject(error)
                }
            )
        } catch (error) {
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message
            reject({ message: errorMessage })
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.SAVE_ACCOUNT_INFO]: saveAccountInfo,
        [Actions.SAVE_ACCOUNT_ADDRESS]: saveAccountAddress,
        [Actions.REQUEST_ACTIVATION_EMAIL]: requestActivationEmail,
        [Actions.GET_TRANSACTION_HISTORY]: getTransactionHistory
    }
})
