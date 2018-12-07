import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IKeyHandler, IContractFactory } from '../../common/types'
import { Observable, forkJoin, from } from 'rxjs'
import { tap, map, filter } from 'rxjs/operators'

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

//

function getClaimedChannels(
    claimedChannelPromises: Array<Promise<any>>
): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const claimedFork$ = forkJoin(claimedChannelPromises).pipe(
            filter((channels: any[]) => {
                if (channels.length > 0) {
                    return channels[0].length > 0
                }
                return false
            }),
            map((channels: any[]) => {
                return channels[0]
            }),
            map((channels: any[]) => {
                return channels.map((channel: any) => {
                    const { transactionHash, returnValues } = channel
                    const {
                        id,
                        isHouse,
                        channelNonce,
                        timestamp
                    } = returnValues
                    return {
                        transactionHash,
                        id,
                        isHouse,
                        channelNonce,
                        timestamp
                    }
                })
            })
        )

        const claimedSub = claimedFork$.subscribe(
            result => {
                claimedSub.unsubscribe()
                resolve(result)
            },
            error => {
                console.error(error)
                reject(error)
            }
        )
    })
}

function getFinalbalances(
    finalBalancePromises: Array<Promise<any>>
): Promise<number[]> {
    return new Promise((resolve, reject) => {
        // get finalBalances after claim
        const finalBalanceFork$ = forkJoin(finalBalancePromises).pipe(
            map((balances: string[]) => {
                return balances.map(balance => Number(balance))
            })
        )

        const finalBalanceSub = finalBalanceFork$.subscribe(
            result => {
                finalBalanceSub.unsubscribe()
                resolve(result)
            },
            error => {
                console.error(error)
                reject(error)
            }
        )
    })
}

function getFinalizedChannels(
    finalizedPromise: Promise<any>,
    channels: any[]
): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const finalized$ = from(finalizedPromise).pipe(
            map((finalizedChannels: any[]) => {
                return finalizedChannels.map((event: any) => {
                    const { transactionHash, returnValues } = event
                    const {
                        id,
                        isHouse,
                        channelNonce,
                        timestamp
                    } = returnValues
                    return {
                        transactionHash,
                        id,
                        isHouse,
                        channelNonce,
                        timestamp
                    }
                })
            }),
            map((finalizedChannels: any[]) => {
                return finalizedChannels.filter(channel => {
                    const exist = channels.find(item => item.id === channel.id)
                    if (exist) {
                        return true
                    }
                    return false
                })
            })
        )

        const finalizedSub = finalized$.subscribe(
            result => {
                finalizedSub.unsubscribe()
                resolve(result)
            },
            error => {
                console.error(error)
                reject(error)
            }
        )
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

            const channels$: Observable<any> = LogNewChannel$.pipe(
                tap(() => {
                    totalRequests++
                }),
                map((i: any) => {
                    return i.map(event => {
                        const { transactionHash } = event
                        const { returnValues } = event
                        const {
                            id,
                            channelNonce,
                            initialDeposit,
                            timestamp
                        } = returnValues
                        return {
                            id,
                            channelNonce,
                            initialDeposit,
                            timestamp,
                            transactionHash
                        }
                    })
                })
            )

            const subs = channels$.subscribe(
                async (channels: any[]) => {
                    if (channels.length > 0 || totalRequests >= topRequests) {
                        subs.unsubscribe() // stop making requests
                        if (channels.length > 0) {
                            // end session => LogChannelFinalized
                            const finalizedChannels = await getFinalizedChannels(
                                slotsChannelManagerContract.getFinalizedChannels(),
                                channels
                            )

                            // claim => LogClaimChannelTokens
                            const claimedPromises = channels.map(channel =>
                                slotsChannelManagerContract.getClaimedChannels(
                                    channel.id
                                )
                            )

                            const finalBalancePromises = channels.map(channel =>
                                slotsChannelManagerContract.finalBalances(
                                    channel.id,
                                    false
                                )
                            )

                            const claimedChannels = await getClaimedChannels(
                                claimedPromises
                            )

                            const finalBalances = await getFinalbalances(
                                finalBalancePromises
                            )

                            const transactionHistory = channels.map(
                                (channel, index) => {
                                    const finalized = finalizedChannels.find(
                                        value => {
                                            return value.id === channel.id
                                        }
                                    )
                                    const claimed = claimedChannels.find(
                                        value => {
                                            return value.id === channel.id
                                        }
                                    )
                                    const finalBalance = finalBalances.find(
                                        (_value, i) => {
                                            return i === index
                                        }
                                    )
                                    return {
                                        ...channel,
                                        finalized,
                                        claimed,
                                        finalBalance
                                    }
                                }
                            )

                            resolve(transactionHistory)
                        } else {
                            resolve([])
                        }
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
