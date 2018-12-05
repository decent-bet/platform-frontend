import ActionTypes, { PREFIX } from './ActionTypes'
import { Action } from 'redux-actions'
import {
    Payload,
    IPayloadGetHouseBalance,
    IPayloadGetHouseDeposits
} from './Payload'
import { IState, DefaultState } from './IState'

/**
 * State Reducer for the House Component
 */
export default function houseReducer(
    state = DefaultState,
    action: Action<Payload>
): IState {
    if (!action.payload) return { ...state }
    switch (action.type) {
        case `${PREFIX}/${ActionTypes.GET_HOUSE_BALANCE}`:
            return {
                ...state,
                houseBalance: (action.payload as IPayloadGetHouseBalance)
                    .balance
            }
        case `${PREFIX}/${ActionTypes.GET_HOUSE_DEPOSITS}`:
            return {
                ...state,
                houseDepositList: (action.payload as IPayloadGetHouseDeposits)
                    .depositItemList
            }
        default:
            return { ...state }
    }
}