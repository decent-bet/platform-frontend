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
    currentSession: -1,
    spins: {
        aesKey: '0x',
        info: { initialDeposit: 0 },
        houseAuthorizedAddress: '0x',
        hashes: {},
        nonce: 0,
        houseSpins: [],
        lastSpinLoaded: false,
        finalized: false,
        closed: false,
        claimed: {}
    }
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

function spinsSubreducer(spinState, action = { type: null }) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_AES_KEY}/${FULFILLED}`:
            return { ...spinState, aesKey: action.payload }

        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${FULFILLED}`:
            return { ...spinState, ...action.payload }

        case `${PREFIX}/${Actions.GET_LAST_SPIN}/${FULFILLED}`:
            return { ...spinState, ...action.payload }

        case `${PREFIX}/${Actions.NONCE_INCREASE}`:
            return { ...spinState, nonce: spinState.nonce + 1 }

        case `${PREFIX}/${Actions.POST_SPIN}`:
            return {
                ...spinState,
                houseSpins: [...spinState.houseSpins, action.payload]
            }

        default:
            return { ...spinState }
    }
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

        case `${PREFIX}/${Actions.GET_AES_KEY}/${FULFILLED}`:
        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${FULFILLED}`:
        case `${PREFIX}/${Actions.GET_LAST_SPIN}/${FULFILLED}`:
        case `${PREFIX}/${Actions.NONCE_INCREASE}`:
        case `${PREFIX}/${Actions.POST_SPIN}`:
            return {
                ...slotsManagerState,
                spins: spinsSubreducer(slotsManagerState.spins, action)
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
