import { IThunkDependencies } from '../../common/types'
import { Action } from 'redux-actions'
import { IPayloadGetHouseBalance } from './Payload'
import ActionTypes, { PREFIX } from './ActionTypes'
import BigNumber from 'bignumber.js'

/**
 * Thunk that will retrieve the Balance for the house from Vechain blockchain
 */
export function getHouseBalance() {
    return async (
        dispatch,
        _getState,
        { contractFactory }: IThunkDependencies
    ) => {
        const contract = await contractFactory.slotsChannelManagerContract()
        const contractAddress = contract.instance._address
        const balance = (await contract.instance.methods
            .balanceOf(contractAddress)
            .call()) as BigNumber
        const action: Action<IPayloadGetHouseBalance> = {
            type: `${PREFIX}/${ActionTypes.GET_HOUSE_BALANCE}`,
            payload: {
                balance
            }
        }
        return dispatch(action)
    }
}
