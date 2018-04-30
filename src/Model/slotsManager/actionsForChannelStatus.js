import { createActions } from 'redux-actions'
import DecentAPI from '../../Components/Base/DecentAPI'
import Bluebird from 'bluebird'
import Actions, { PREFIX } from './actionTypes'
import Helper from '../../Components/Helper'
import { getSpin } from './functions'

const helper = new Helper()
const decentApi = new DecentAPI()

/**
 * Finalizes a channel allowing users to claim DBETs
 * @param {number} channelId
 * @param state
 */
async function finalizeChannel(channelId, state) {
    let aesKey = state.aesKey
    try {
        let betSize = helper.convertToEther(1)

        let userSpin = await getSpin(betSize, state)
        let lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
        const txHash = await helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelFinalizer()
            .finalize(channelId, userSpin, lastHouseSpin)
        /**
         * After sending a finalize channel tx on the Ethereum network let the state channel API know that
         * the transaction was sent to make sure future spins aren't processed.
         */
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

/**
 * Allows users to claim DBETs from a closed channel
 * @param {number} channelId
 * @param state
 */
async function claimChannel(channelId) {
    const instance = helper.getContractHelper().SlotsChannelManager
    const txHash = await instance.claim(channelId)
    helper.toggleSnackbar('Successfully sent claim DBETs transaction')
    return txHash
}

export default createActions({
    [PREFIX]: {
        [Actions.FINALIZE_CHANNEL]: finalizeChannel,
        [Actions.CLAIM_CHANNEL]: claimChannel
    }
})
