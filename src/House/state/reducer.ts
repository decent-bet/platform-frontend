import ActionTypes, { PREFIX } from './ActionTypes'
import { Action } from 'redux-actions'
import { Payload } from './Payload'
import { IState, DefaultState } from './IState'

/**
 * State Reducer for the House Component
 */
export default function houseReducer(
    state = DefaultState,
    action: Action<Payload>
): IState {
    switch (action.type) {
        case `${PREFIX}/${ActionTypes.GET_HOUSE_BALANCE}`:
            if (!action.payload) return { ...state }
            return { ...state, houseBalance: action.payload.balance }
        default:
            return { ...state }
    }
}
