import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'
import {
    CHANNEL_STATUS_ACTIVATED,
    CHANNEL_STATUS_FINALIZED,
    CHANNEL_STATUS_DEPOSITED
} from '../../constants'
import { Action } from 'redux-actions'
import { IChannel, ChannelDefaultState } from './IChannel'
import BigNumber from 'bignumber.js'

interface IChannelMap {
    readonly [id: string]: IChannel
}

const casinoDefaultState = {
    houseBalance: new BigNumber(0),
    isCasinoLogedIn: false,
    slotsInitialized: false,
    channels: {} as IChannelMap,
    allowance: 0,
    balance: 0, // channel balance
    tokenBalance: 0,
    vthoBalance: 0
}

function stateChannelSubreducer(
    channelMap: IChannelMap = {},
    action: Action<any> = { type: '', payload: undefined }
): IChannelMap {
    if (!action.payload) return { ...channelMap }
    let { channelId } = action.payload

    if (!channelId) return { ...channelMap }
    let channel: IChannel = { ...channelMap[channelId] }

    if (!channel) channel = ChannelDefaultState

    switch (action.type) {
        case `${PREFIX}/${Actions.GET_CHANNEL}/${FULFILLED}`:
            channel = { ...action.payload }
            break

        case `${PREFIX}/${Actions.SET_CHANNEL_DEPOSITED}`:
            if (
                channel.status !== CHANNEL_STATUS_ACTIVATED &&
                channel.status !== CHANNEL_STATUS_FINALIZED
            ) {
                channel = { ...channel, status: CHANNEL_STATUS_DEPOSITED }
            }
            break

        case `${PREFIX}/${Actions.SET_CHANNEL_ACTIVATED}`:
            if (channel.status !== CHANNEL_STATUS_FINALIZED) {
                channel = { ...channel, status: CHANNEL_STATUS_ACTIVATED }
            }
            break

        case `${PREFIX}/${Actions.SET_CHANNEL_FINALIZED}`:
            channel = { ...channel, status: CHANNEL_STATUS_FINALIZED }
            break

        case `${PREFIX}/${Actions.SET_CHANNEL_CLAIMED}`:
            let { isHouse } = action.payload
            if (isHouse) {
                channel = {
                    ...channel,
                    claimed: { ...channel.claimed, house: true }
                }
            } else {
                channel = {
                    ...channel,
                    claimed: { ...channel.claimed, user: true }
                }
            }
            break

        case `${PREFIX}/${Actions.GET_AES_KEY}/${FULFILLED}`:
            channel = { ...channel, aesKey: action.payload.key }
            break

        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${FULFILLED}`:
            channel = { ...channel, ...action.payload }
            break
        case `${PREFIX}/${Actions.GET_LAST_SPIN}/${FULFILLED}`:
            channel = { ...channel, ...action.payload }
            break

        case `${PREFIX}/${Actions.NONCE_INCREASE}`:
            channel = { ...channel, nonce: channel.nonce + 1 }
            break

        case `${PREFIX}/${Actions.POST_SPIN}`:
            channel = {
                ...channel,
                houseSpins: [...channel.houseSpins, action.payload]
            }
            break

        case `${PREFIX}/${Actions.GET_CHANNEL_DEPOSITS}/${FULFILLED}`:
            channel = {
                ...channel,
                houseBalance: action.payload.house,
                playerBalance: action.payload.player
            }
            break

        default:
            break
    }

    return { ...channelMap, [channelId]: channel }
}

export default function slotsManagerReducer(
    casinoState: any = casinoDefaultState,
    action: Action<any> = { type: '' }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_BALANCE}/${FULFILLED}`:
            return { ...casinoState, balance: action.payload }

        case `${PREFIX}/${Actions.GET_HOUSE_BALANCE}/${FULFILLED}`:
            return { ...casinoState, houseBalance: action.payload }

        case `${PREFIX}/${Actions.SET_CHANNEL}`:
            let newChannel = action.payload
            return {
                ...casinoState,
                channels: {
                    ...casinoState.channels,
                    [newChannel.id]: newChannel
                }
            }

        case `${PREFIX}/${Actions.GET_CHANNELS}/${FULFILLED}`:
            return {
                ...casinoState,
                channels: { ...action.payload }
            }

        case `${PREFIX}/${Actions.AUTH_WALLET}/${FULFILLED}`:
            return {
                ...casinoState,
                isCasinoLogedIn: action.payload
            }
        case `${PREFIX}/${Actions.SET_SLOTS_INITIALIZED}/${FULFILLED}`:
            return {
                ...casinoState,
                slotsInitialized: action.payload
            }
        case `${PREFIX}/${Actions.GET_CASINO_LOGIN_STATUS}/${FULFILLED}`:
            return {
                ...casinoState,
                isCasinoLogedIn: action.payload
            }
        case `${PREFIX}/${Actions.GET_VTHO_BALANCE}/${FULFILLED}`:
            return {
                ...casinoState,
                vthoBalance: action.payload
            }
        case `${PREFIX}/${Actions.GET_TOKENS}/${FULFILLED}`:
            return {
                ...casinoState,
                tokenBalance: action.payload
            }

        default:
            return {
                ...casinoState,
                channels: stateChannelSubreducer(casinoState.channels, action)
            }
    }
}
