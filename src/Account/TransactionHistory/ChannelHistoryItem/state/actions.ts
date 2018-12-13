import moment from 'moment'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IUtils } from '../../../../common/types'
import SlotsChannelManagerContract from '../../../../common/ContractFactory/contracts/SlotsChannelManagerContract'
import BigNumber from 'bignumber.js'
import { forkJoin } from 'rxjs'

const HOSE_DEPOSIT = new BigNumber(10000)

function getChannelDetails(
    channelId: string,
    initialDeposit: string,
    utils: IUtils,
    contract: SlotsChannelManagerContract
) {
    const finalizedPromise = contract.getEventData('LogChannelFinalized', {
        id: channelId,
        isHouse: false
    })

    const claimedPromise = contract.getEventData('LogClaimChannelTokens', {
        id: channelId,
        isHouse: false
    })

    const houseBalancePromise = contract.instance.methods
        .channelBalanceOf(channelId, true)
        .call()

    const infoPromise = contract.getChannelInfo(channelId)

    const detailsSubscription = forkJoin([
        finalizedPromise,
        claimedPromise,
        houseBalancePromise,
        infoPromise
    ]).subscribe((results: any[]) => {
        detailsSubscription.unsubscribe()
        const [finalizeEvents, claimedEvents, houseBalance] = results

        // finalize data
        let finalizeData: any | null
        if (finalizeEvents && (finalizeEvents as any[]).length > 0) {
            const [event] = finalizeEvents
            const { transactionHash } = event
            finalizeData = {
                transactionHash
            }
        } else {
            finalizeData = null
        }

        // claimed data
        let claimedData: any | null
        if (claimedEvents && (claimedEvents as any[]).length > 0) {
            const [channelArray] = claimedEvents
            if (channelArray.length > 0) {
                const [channel] = channelArray
                const { transactionHash, returnValues } = channel
                const { timestamp } = returnValues

                claimedData = {
                    transactionHash,
                    timestamp
                }
            }
        } else {
            claimedData = null
        }

        // get the amount of dbets claimed
        let claimedDbets: string
        if (claimedData) {
            const houseDeposit = utils.convertToEther(HOSE_DEPOSIT)
            const finalHouseBalance = new BigNumber(houseBalance)
            const deposit = new BigNumber(initialDeposit).plus(houseDeposit)
            const claimedAmount = deposit.minus(finalHouseBalance)
            claimedDbets = utils.formatEther(claimedAmount)
        } else {
            claimedDbets = ''
        }

        return {
            finalize: {
                finalized: finalizeData ? true : false,
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
                transactionHash: claimedData ? claimedData.transactionHash : ''
            }
        }
    })
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_CHANNEL_DETAILS]: getChannelDetails
    }
})
