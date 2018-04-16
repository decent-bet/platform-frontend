import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultState = {
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

export default function spinsReducer(
    handlerState = DefaultState,
    action = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_AES_KEY}/${FULFILLED}`:
            return { ...handlerState, aesKey: action.payload }

        case `${PREFIX}/${Actions.GET_CHANNEL_DETAILS}/${FULFILLED}`:
            return { ...handlerState, ...action.payload }

        case `${PREFIX}/${Actions.GET_LAST_SPIN}/${FULFILLED}`:
            return { ...handlerState, ...action.payload }

        case `${PREFIX}/${Actions.NONCE_INCREASE}`:
            return { ...handlerState, nonce: handlerState.nonce + 1 }

        case `${PREFIX}/${Actions.POST_SPIN}`:
            return {
                ...handlerState,
                houseSpins: [...handlerState.houseSpins, action.payload]
            }

        default:
            return { ...handlerState }
    }
}
