import { IThunkDependencies } from '../../common/types'
import { Action } from 'redux-actions'
import { Dispatch } from 'redux'
import { IPayloadGetHouseBalance, IPayloadGetHouseDeposits } from './Payload'
import ActionTypes, { PREFIX } from './ActionTypes'
import BigNumber from 'bignumber.js'
import { IDepositItem } from './IDepositItem'
import * as moment from 'moment'

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
 * Thunk that will list all the deposits done to the House Address
 */
export function getHouseDeposits() {
    return async function(
        dispatch: Dispatch,
        _getState,
        dependencies: IThunkDependencies
    ) {
        // Get all the `LogDeposit` events from the contract
        const contract = (await dependencies.contractFactory.slotsChannelManagerContract())
            .instance
        const depositList = await contract.getPastEvents('LogDeposit', {
            fromBlock: 0,
            toBlock: 'latest'
        })

        // Filter events. Only return events that came from this contract address
        const cachedAddress = (contract._address as string).toLowerCase() // Execute this only once
        const filteredEvents: IDepositItem[] = depositList
            .filter(
                item =>
                    item.returnValues._address.toLowerCase() === cachedAddress
            )
            .map(
                // Parse the Event into a the return values
                item =>
                    ({
                        amount: item.returnValues.amount,
                        fromAddress: item.address,
                        toAddress: item.returnValues._address,
                        balance: item.returnValues.balance,
                        txHash: item.transactionHash,
                        date: moment(item.meta.blockTimestamp * 1000)
                    } as IDepositItem)
            )

        // Build Action and dispatch
        return dispatch({
            type: `${PREFIX}/${ActionTypes.GET_HOUSE_DEPOSITS}`,
            payload: {
                depositItemList: filteredEvents
            }
        } as Action<IPayloadGetHouseDeposits>)
    }
}
