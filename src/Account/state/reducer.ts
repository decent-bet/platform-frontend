import Actions, { PREFIX } from './actionTypes'
import { FULFILLED, PENDING } from 'redux-promise-middleware'

const DefaultState = {
    accountInfoSaved: false,
    loading: false,
    accountAddressSaved: false,
    channels: [],
    channelsNotFound: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_INFO}/${PENDING}`:
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_ADDRESS}/${PENDING}`:
            return {
                ...state,
                loading: true
            }
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_ADDRESS}/${FULFILLED}`:
            return {
                ...state,
                accountInfoSaved: true
            }
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_INFO}/${FULFILLED}`:
            return {
                ...state,
                accountAddressSaved: true
            }
        default:
            return { ...state }
    }
}
