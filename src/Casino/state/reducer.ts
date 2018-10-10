import Actions, { PREFIX } from './actions/actionTypes'
import { FULFILLED } from 'redux-promise-middleware'
import { DEFAULT_STAGE } from '../../config'
import {
    CHANNEL_STATUS_ACTIVATED,
    CHANNEL_STATUS_FINALIZED,
    CHANNEL_STATUS_DEPOSITED
} from '../../constants'

const SlotsManagerDefaultState = {
    currentStage: DEFAULT_STAGE,
    authenticated: false,
    channels: {},
    allowance: 0,
    balance: 0
}

const ChannelDefaultState = {
    aesKey: '0x',
    info: { initialDeposit: 0 },
    houseAuthorizedAddress: '0x',
    houseBalance: 0,
    playerBalance: 0,
    hashes: {},
    nonce: 0,
    houseSpins: [],
    lastSpinLoaded: false,
    finalized: false,
    closed: false,
    deposited: 0,
    claimed: {
        // [true]: false,
        // [false]: false
    }
}

function stateChannelSubreducer(
    channelState = ChannelDefaultState,
    action: any = { type: null, payload: null }
) {
    if (!action.payload) return { ...channelState }
    let { channelId } = action.payload

    if (!channelId) return { ...channelState }
    let channel = { ...channelState[channelId] }

    if (!channel) channel = {}

    switch (action.type) {

        case `${PREFIX}/${Actions.GET_CHANNEL}/${FULFILLED}`:
            channel = action.payload
            break

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

        case `${PREFIX}/${Actions.GET_AES_KEY}/${FULFILLED}`:
            channel.aesKey = action.payload.key
            break

        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${FULFILLED}`:
            channel = {...channel, ...action.payload}
            break
        case `${PREFIX}/${Actions.GET_LAST_SPIN}/${FULFILLED}`:
            channel = { ...channel, ...action.payload }
            break

        case `${PREFIX}/${Actions.NONCE_INCREASE}`:
            channel.nonce++
            break

        case `${PREFIX}/${Actions.POST_SPIN}`:
            channel.houseSpins = [...channel.houseSpins, action.payload]
            break

        case `${PREFIX}/${Actions.GET_CHANNEL_DEPOSITS}/${FULFILLED}`:
            channel.houseBalance = action.payload.house
            channel.playerBalance = action.payload.player
            break

        default:
            break
    }

    return { ...channelState, [channelId]: channel }
}

export default function slotsManagerReducer(
    slotsManagerState: any = SlotsManagerDefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_BALANCE}/${FULFILLED}`:
            return { ...slotsManagerState, balance: action.payload }

        case `${PREFIX}/${Actions.SET_CHANNEL}`:
            let newChannel = action.payload
            return {
                ...slotsManagerState,
                channels: {
                    ...slotsManagerState.channels,
                    [newChannel.id]: newChannel
                }
            }

        case `${PREFIX}/${Actions.GET_CHANNELS}/${FULFILLED}`:
            return {
                ...slotsManagerState,
                channels: { ...action.payload }
            }

        case `${PREFIX}/${Actions.AUTH_WALLET}/${FULFILLED}`:
            return {
                ...slotsManagerState,
                authenticated: action.payload
            }
        case `${PREFIX}/${Actions.GET_CURRENT_STAGE}/${FULFILLED}`:
            return {
                ...slotsManagerState,
                currentStage: action.payload
            }
        case `${PREFIX}/${Actions.SET_CURRENT_STAGE}/${FULFILLED}`:
            return {
                ...slotsManagerState,
                currentStage: action.payload
            }

        default:
            return {
                ...slotsManagerState,
                channels: stateChannelSubreducer(
                    slotsManagerState.channels,
                    action
                )
            }
    }
}
