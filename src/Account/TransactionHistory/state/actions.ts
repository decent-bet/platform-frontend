import moment from 'moment'
import SlotsChannelManagerContract from '../../../common/ContractFactory/contracts/SlotsChannelManagerContract'
import BigNumber from 'bignumber.js'
import { forkJoin } from 'rxjs'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IContractFactory, IUtils } from '../../../common/types'
import IChannelsHistory from '../IChannelHistory'

const HOUSE_DEPOSIT = new BigNumber(10000)
const CLAIM_MINUTES = 15

function getChannelDetails(
    channelId: string,
    initialDeposit: string,
    utils: IUtils,
    contract: SlotsChannelManagerContract
) {
    return new Promise((resolve, reject) => {
        try {
            const finalizedPromise = contract.getEventData(
                'LogChannelFinalized',
                {
                    id: channelId,
                    isHouse: false
                }
            )

            const claimedPromise = contract.getEventData(
                'LogClaimChannelTokens',
                {
                    id: channelId,
                    isHouse: false
                }
            )

            const houseBalancePromise = contract.instance.methods
                .channelBalanceOf(channelId, true)
                .call()

            const infoPromise = contract.getChannelInfo(channelId)
            const finalBalancesPromise = contract.instance.methods
                .finalBalances(channelId, false)
                .call()

            const detailsSubscription = forkJoin([
                finalizedPromise,
                claimedPromise,
                houseBalancePromise,
                infoPromise,
                finalBalancesPromise
            ]).subscribe((results: any[]) => {
                detailsSubscription.unsubscribe()
                const [
                    finalizeEvents,
                    claimedEvents,
                    houseBalance,
                    info,
                    finalBalance
                ] = results

                // info data
                let infoData: any | null
                if (info) {
                    const playerAddress = info[0]
                    infoData = {
                        playerAddress,
                        ready: info[1],
                        activated: info[2],
                        finalized: info[3],
                        initialDeposit: info[4],
                        finalNonce: info[5],
                        endTime: info[6],
                        exists: playerAddress === '0x0'
                    }
                } else {
                    infoData = null
                }

                // finalize data
                let finalizeData: any | null
                if (finalizeEvents && (finalizeEvents as any[]).length > 0) {
                    const [event] = finalizeEvents
                    const { transactionHash } = event
                    finalizeData = {
                        transactionHash,
                        finalized: infoData ? infoData.finalized : false,
                        finalBalance: new BigNumber(finalBalance)
                    }
                } else {
                    finalizeData = null
                }

                // claimed data
                let claimedData: any | null
                if (claimedEvents && (claimedEvents as any[]).length > 0) {
                    const [event] = claimedEvents
                    if (event) {
                        const { transactionHash, returnValues } = event
                        const { timestamp } = returnValues

                        claimedData = {
                            transactionHash,
                            timestamp
                        }
                    }
                } else {
                    claimedData = null
                }

                /**
                 * 
                 * get the amount of dbets claimed
                 * 
                 * -> initial house deposit: 100000000 (the house initial deposit is always 10k)
                 * -> initial user deposit: 1000000
                 * -> final house balance: 100100000
                 
                 * ----> final channel balance: 101000000 ( initial house deposit + initial user deposit)
                 * ----> amount of dbets claimed: 900000 (final channel balance - final house balance)
                 * 
                 * resume: claimed dbets = ((initialDeposit + 10k) - finalHouseBalance)
                 */

                let claimedDbets: string
                if (claimedData) {
                    const initialHouseDeposit = new BigNumber(
                        utils.convertToEther(HOUSE_DEPOSIT)
                    )
                    const initualUserDeposit = new BigNumber(
                        utils.convertToEther(initialDeposit)
                    )
                    const finalHouseBalance = new BigNumber(houseBalance)

                    const finalChannelBalance = initialHouseDeposit.plus(
                        initualUserDeposit
                    )

                    const claimedAmount = finalChannelBalance.minus(
                        finalHouseBalance
                    )

                    claimedDbets = utils.formatEther(claimedAmount)
                } else {
                    claimedDbets = ''
                }

                const result = {
                    finalize: {
                        finalized: finalizeData
                            ? finalizeData.finalized
                            : false,
                        finalBalance: finalizeData
                            ? utils.formatEther(finalizeData.finalBalance)
                            : null,
                        time: infoData
                            ? moment
                                  .unix(infoData.endTime)
                                  .subtract(CLAIM_MINUTES, 'minutes')
                                  .format()
                            : '',
                        transactionHash: finalizeData
                            ? finalizeData.transactionHash
                            : ''
                    },
                    claim: {
                        claimed: claimedData ? true : false,
                        amount: claimedDbets,
                        time: claimedData
                            ? moment.unix(claimedData.timestamp).format()
                            : '',
                        transactionHash: claimedData
                            ? claimedData.transactionHash
                            : ''
                    }
                }

                resolve({ id: channelId, details: result })
            })
        } catch (error) {
            console.error(error)
            reject({ message: 'Error getting channel details.' })
        }
    })
}

async function getChannelsHistory(
    contractFactory: IContractFactory,
    utils: IUtils,
    address: string,
    currentIndex: number = 0
): Promise<IChannelsHistory> {
    try {
        const contract = await contractFactory.slotsChannelManagerContract(
            address
        )

        const channelsSource = await contract.getEventData(
            'LogNewChannel',
            {
                user: address
            },
            currentIndex
        )
        if (channelsSource) {
            const items = channelsSource.map(event => {
                const { transactionHash, returnValues } = event
                const {
                    id,
                    channelNonce,
                    initialDeposit,
                    timestamp
                } = returnValues
                return {
                    id,
                    channelNonce,
                    initialDeposit: utils.formatEther(initialDeposit),
                    timestamp: moment.unix(parseInt(timestamp)).format(),
                    transactionHash
                }
            })

            return { currentIndex, items }
        } else {
            return { currentIndex, items: [] }
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
        [Actions.GET_CHANNELS_HISTORY]: getChannelsHistory,
        [Actions.GET_CHANNEL_DETAILS]: getChannelDetails
    }
})
