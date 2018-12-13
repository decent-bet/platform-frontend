import moment from 'moment'
import { createActions } from 'redux-actions'
import Actions, { PREFIX } from './actionTypes'
import { IContractFactory, IUtils } from 'src/common/types'
import IChannelHistoryItem from '../IChannelHistoryItem'

async function getChannelsHistory(
    contractFactory: IContractFactory,
    utils: IUtils,
    address: string,
    currentIndex: number = 0
): Promise<IChannelHistoryItem[]> {
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
            return channelsSource.map(event => {
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
        [Actions.GET_CHANNELS_HISTORY]: getChannelsHistory
    }
})
