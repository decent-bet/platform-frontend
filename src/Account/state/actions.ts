import axios from 'axios'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IKeyHandler, IContractFactory } from '../../common/types'
import { Observable, forkJoin } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import SlotsChannelManagerContract from '../../common/ContractFactory/contracts/SlotsChannelManagerContract'
import IChannelHistoryItem from '../TransactionHistory/ChannelHistoryItem/IChannelHistoryItem'

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

async function getEventData(
    eventName: string,
    contract: SlotsChannelManagerContract,
    filter: any,
    interval: number = 1000,
    top: number = 3
): Promise<any[]> {
    const events: any[] = await contract.listenForEvent(
        eventName,
        {
            config: {
                filter,
                toBlock: 'latest',
                order: 'DESC'
            },
            interval,
            top
        },
        (events: any[]) => events.length > 0
    )

    return events
}

async function getChannels(
    address: string,
    contract: SlotsChannelManagerContract
): Promise<any[]> {
    const channelsSource = await getEventData('LogNewChannel', contract, {
        user: address
    })

    if (channelsSource) {
        return channelsSource.map(event => {
            const { transactionHash, returnValues } = event
            const { id, channelNonce, initialDeposit, timestamp } = returnValues
            return {
                id,
                channelNonce,
                initialDeposit,
                createTime: timestamp,
                txCreateHash: transactionHash
            }
        })
    } else {
        return []
    }
}

function getChannelsWithDetails(
    contract: SlotsChannelManagerContract,
    channels: any[]
): Promise<any[]> {
    const detailsPromises = channels.map(channel => {
        return contract.getChannelInfo(channel.id)
    })

    const detailsFork$: Observable<any[]> = forkJoin(detailsPromises)

    return new Promise<any[]>((resolve, reject) => {
        const detailsSub = detailsFork$.subscribe(
            detailsList => {
                detailsSub.unsubscribe()

                const result = detailsList.map((channelInfo: any) => {
                    const [
                        userAddress,
                        ready,
                        activated,
                        finalized,
                        initialDeposit,
                        finalNonce,
                        endTime,
                        id
                    ] = channelInfo

                    return {
                        id,
                        userAddress,
                        ready,
                        activated,
                        finalized,
                        initialDeposit,
                        finalNonce,
                        endTime,
                        exists: userAddress === '0x0'
                    }
                })
                resolve(result)
            },
            error => {
                reject(error)
            }
        )
    })
}

function getClaimedChannels(
    contract: SlotsChannelManagerContract,
    channels: any[]
): Promise<any[]> {
    const claimedChannelPromises = channels.map(channel => {
        return getEventData('LogChannelFinalized', contract, {
            id: channel.id
        })
    })

    const claimedFork$: Observable<any[]> = forkJoin(
        claimedChannelPromises
    ).pipe(
        filter((claimedChannels: any[]) => {
            if (claimedChannels.length > 0) {
                return claimedChannels[0].length > 0
            }
            return false
        }),
        map((claimedChannels: any[]) => {
            return claimedChannels[0]
        })
    )

    return new Promise<any[]>((resolve, reject) => {
        const claimedSub = claimedFork$.subscribe(
            claimedChannels => {
                claimedSub.unsubscribe()
                const result = claimedChannels.map((channel: any) => {
                    const { transactionHash, returnValues } = channel
                    const { id, isHouse, channelNonce } = returnValues

                    return {
                        txtClaimHash: transactionHash,
                        id,
                        isHouse,
                        channelNonce
                    }
                })

                resolve(result)
            },
            error => {
                reject(error)
            }
        )
    })
}

async function getFinalizedChannels(
    contract: SlotsChannelManagerContract,
    address: string,
    channels: any[]
): Promise<any[]> {
    const events = await getEventData('LogChannelFinalized', contract, {
        user: address
    })

    const finalizedChannels = events.map((event: any) => {
        const { transactionHash, returnValues } = event
        const { id, isHouse, channelNonce, timestamp } = returnValues
        return {
            txFinalizeHash: transactionHash,
            id,
            isHouse,
            channelNonce,
            timestamp
        }
    })

    const filteredChannels = finalizedChannels.filter(channel => {
        const exist = channels.find(item => item.id === channel.id)
        if (exist) {
            return true
        }
        return false
    })

    return filteredChannels
}

async function getTransactionHistory(
    contractFactory: IContractFactory,
    address: string
): Promise<IChannelHistoryItem[]> {
    try {
        const contract = await contractFactory.slotsChannelManagerContract(
            address
        )
        const channels = await getChannels(address, contract)

        if (channels.length > 0) {
            const finalizedChannels = await getFinalizedChannels(
                contract,
                address,
                channels
            )

            const claimedChannels = await getClaimedChannels(contract, channels)
            const channelsDetails = await getChannelsWithDetails(
                contract,
                channels
            )

            const transactionHistory = channels.map((channel, index) => {
                const finalized = finalizedChannels.find(value => {
                    return value.id === channel.id
                })

                const claimed = claimedChannels.find(value => {
                    return value.id === channel.id
                })
                const details = channelsDetails.find(value => {
                    return value.id === channel.id
                })

                return {
                    ...channel,
                    ...details,
                    txFinalizeHash: finalized ? finalized.txFinalizeHash : null,
                    txClaimHash: claimed ? claimed.txClaimHash : null
                }
            })

            return transactionHistory
        } else {
            return []
        }
    } catch (error) {
        let errorMessage =
            error.response && error.response.data
                ? error.response.data.message
                : error.message
        return Promise.reject({ message: errorMessage })
    }
}

export default createActions({
    [PREFIX]: {
        [Actions.SAVE_ACCOUNT_INFO]: saveAccountInfo,
        [Actions.SAVE_ACCOUNT_ADDRESS]: saveAccountAddress,
        [Actions.REQUEST_ACTIVATION_EMAIL]: requestActivationEmail,
        [Actions.GET_TRANSACTION_HISTORY]: getTransactionHistory
    }
})
