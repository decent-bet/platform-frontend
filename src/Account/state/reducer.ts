import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultState = {
    accountInfoSaved: false,
    accountAddressSaved: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_ADDRESS}/${FULFILLED}`:
            return {
                accountInfoSaved: true
            }
        case `${PREFIX}/${Actions.SAVE_ACCOUNT_INFO}/${FULFILLED}`:
            return {
                accountAddressSaved: true
            }
        default:
            return { ...state }
    }
}
