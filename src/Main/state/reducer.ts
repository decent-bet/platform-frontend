import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultMainState = {
    profile: null,
    balance: 0,
    etherBalance: 0,
    address: '0x'
}

export default function reducer(
    mainState = DefaultMainState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.GET_PUBLIC_ADDRESS}/${FULFILLED}`:
            return {
                ...mainState,
                address: action.payload
            }
        
        case `${PREFIX}/${Actions.GET_TOKENS}/${FULFILLED}`:
            return {
                ...mainState,
                balance: action.payload
            }
        
        case `${PREFIX}/${Actions.GET_USER_PROFILE}/${FULFILLED}`:
            return {
                ...mainState,
                profile: action.payload
        }
        case `${PREFIX}/${Actions.GET_ETHER_BALANCE}/${FULFILLED}`:
            return {
                ...mainState,
                etherBalance: action.payload
            }

        default:
            return { ...mainState }
    }
}
