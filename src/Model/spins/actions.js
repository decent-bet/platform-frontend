import { createActions } from 'redux-actions'
import Bluebird from 'bluebird'
import Actions, { PREFIX } from './actionTypes'
import SlotsChannelHandler from './SlotsChannelHandler'

const slotsChannelHandler = new SlotsChannelHandler()

async function getAesKey(channelId) {
    return Bluebird.fromCallback(cb =>
        slotsChannelHandler.helpers().getAesKey(channelId, cb)
    )
}

async function getChannelDetails(channelId) {
    let data = await Bluebird.fromCallback(cb =>
        slotsChannelHandler.getChannelDetails(channelId, cb)
    )

    return {
        info: data.info,
        houseAuthorizedAddress: data.houseAuthorizedAddress,
        closed: data.closed,
        hashes: data.hashes
    }
}

async function getLastSpin(channelId) {
    let aesKey = await getAesKey(channelId)
    let { hashes } = await getChannelDetails(channelId)

    let data = await Bluebird.fromCallback(cb =>
        slotsChannelHandler.loadLastSpin(channelId, hashes, aesKey, cb)
    )

    return {
        nonce: data.nonce,
        houseSpins: data.houseSpins,
        userHashes: data.userHashes,
        lastSpinLoaded: true
    }
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_AES_KEY]: getAesKey,
        [Actions.GET_CHANNEL_DETAILS]: getChannelDetails,
        [Actions.GET_LAST_SPIN]: getLastSpin,
        [Actions.NONCE_INCREASE]: () => {},
        [Actions.POST_SPIN]: hash => ({ hash })
    }
})
