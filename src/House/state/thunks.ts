import { IThunkDependencies } from '../../common/types'
import { Action } from 'redux-actions'
import { Dispatch } from 'redux'
import { IPayloadGetHouseBalance, IPayloadGetContractAddress } from './Payload'
import ActionTypes, { PREFIX } from './ActionTypes'
import BigNumber from 'bignumber.js'

/**
 * Thunk that will retrieve the Balance for the house from Vechain blockchain
 */
export function getHouseBalance() {
    return async (
        dispatch: Dispatch,
        _getState,
        { contractFactory }: IThunkDependencies
    ) => {
        // Get contract and address
        const contract = await contractFactory.slotsChannelManagerContract()
        const contractAddress = contract.instance._address

        // Execute
        const balance = (await contract.instance.methods
            .balanceOf(contractAddress)
            .call()) as BigNumber

        // Build Action and dispatch
        return dispatch({
            type: `${PREFIX}/${ActionTypes.GET_HOUSE_BALANCE}`,
            payload: {
                balance
            }
        } as Action<IPayloadGetHouseBalance>)
    }
}

/**
 * Thunk that exports the contract's address
 */
export function getHouseAddress() {
    return async function(
        dispatch: Dispatch,
        _getState,
        dependencies: IThunkDependencies
    ) {
        const contract = await dependencies.contractFactory.slotsChannelManagerContract()
        const instance = contract.instance

        return dispatch({
            type: `${PREFIX}/${ActionTypes.GET_CONTRACT_ADDRESS}`,
            payload: {
                contractAddress: instance._address
            }
        } as Action<IPayloadGetContractAddress>)
    }
}
