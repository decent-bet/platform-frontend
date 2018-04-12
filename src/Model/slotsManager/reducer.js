import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'
import {
    CHANNEL_STATUS_ACTIVATED,
    CHANNEL_STATUS_FINALIZED,
    CHANNEL_STATUS_DEPOSITED
} from '../../Components/Constants'

const SlotsManagerDefaultState = {
    channels: {},
    allowance: 0,
    balance: 0,
    currentSession: -1
}

function stateChannelSubreducer(
    channelState,
    action = { type: null, payload: null }
) {
    let { channelId } = action.payload
    if (!channelId) return channelState

    let channel = { ...channelState[channelId] }
    if (!channel) return channelState

    switch (action.type) {
        case `${PREFIX}/${Actions.SET_CHANNEL_DEPOSITED}`:
            if (
                channel.status !== CHANNEL_STATUS_ACTIVATED &&
                channel.status !== CHANNEL_STATUS_FINALIZED
            ) {
                channel.status = CHANNEL_STATUS_DEPOSITED
            }
            break

        case `${PREFIX}/${Actions.SET_CHANNEL_ACTIVATED}`:
            if (channel.status !== CHANNEL_STATUS_FINALIZED) {
                channel.status = CHANNEL_STATUS_ACTIVATED
            }
            break

        case `${PREFIX}/${Actions.SET_CHANNEL_FINALIZED}`:
            channel.status = CHANNEL_STATUS_FINALIZED
            break

        case `${PREFIX}/${Actions.SET_CHANNEL_CLAIMED}`:
            let { isHouse } = action.payload
            channel.claimed = { ...channel.claimed, [isHouse]: true }
            break

        default:
            break
    }

    return { ...channelState, [channelId]: channel }
}

export default function slotsManagerReducer(
    slotsManagerState = SlotsManagerDefaultState,
    action = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_BALANCE}/${FULFILLED}`:
            return { ...slotsManagerState, balance: action.payload }

        case `${PREFIX}/${Actions.GET_SESSION_ID}/${FULFILLED}`:
            return { ...slotsManagerState, currentSession: action.payload }

        case `${PREFIX}/${Actions.SET_CHANNEL_DEPOSITED}`:
        case `${PREFIX}/${Actions.SET_CHANNEL_ACTIVATED}`:
        case `${PREFIX}/${Actions.SET_CHANNEL_CLAIMED}`:
        case `${PREFIX}/${Actions.SET_CHANNEL_FINALIZED}`:
            return {
                ...slotsManagerState,
                channels: stateChannelSubreducer(
                    slotsManagerState.channels,
                    action
                )
            }

        case `${PREFIX}/${Actions.SET_CHANNEL}`:
            let newChannel = action.payload
            return {
                ...slotsManagerState,
                channels: {
                    ...slotsManagerState.channels,
                    [newChannel.id]: newChannel
                }
            }

        default:
            return { ...slotsManagerState }
    }
}
