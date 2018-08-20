import { createActions } from 'redux-actions'
import DecentAPI from '../../../Components/Base/DecentAPI'
import Bluebird from 'bluebird'
import Actions, { PREFIX } from './actionTypes'
import Helper from '../../../Components/Helper'
import { getSpin } from '../functions'

const helper = new Helper()
let decentApi = null

/**
 * Finalizes a channel allowing users to claim DBETs
 * @param {number} channelId
 * @param {Object} state
 * @param {Object} chainProvider
 */
async function finalizeChannel(channelId, state, chainProvider) {
    let aesKey = state.aesKey
    try {
        let { contractFactory } = chainProvider
        let betSize = helper.convertToEther(1)

        let userSpin = await getSpin(betSize, state, true, chainProvider)
        let lastHouseSpin
        let txHash
        let contract = await contractFactory.slotsChannelFinalizerContract()
        // If the user nonce is 0
        // this would mean that there haven't been any spin performed within the channel.
        if(userSpin.nonce === 0) {
            txHash = await contract.finalizeZeroNonce(channelId, userSpin)
        } else {
            lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
            txHash = await contract.finalize(channelId, userSpin, lastHouseSpin)
        }
        /**
         * After sending a finalize channel tx on the Ethereum network let the state channel API know that
         * the transaction was sent to make sure future spins aren't processed.
         */
        if(!decentApi) {
            decentApi = new DecentAPI(chainProvider.web3)
        }

        await Bluebird.fromCallback(cb =>
            decentApi.finalizeChannel(channelId, userSpin, aesKey, cb)
        )

        let message = 'Successfully sent finalize channel transaction'
        helper.toggleSnackbar(message)
        return txHash
    } catch (err) {
        helper.toggleSnackbar('Error sending finalize channel transaction')
        throw new Error('Error closing channel, ' + err.message)
    }
}

export default createActions({
    [PREFIX]: {
        [Actions.FINALIZE_CHANNEL]: finalizeChannel
    }
})
