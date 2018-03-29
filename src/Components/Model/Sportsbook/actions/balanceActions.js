import Helper from '../../Helper'
import { createAction } from 'redux-actions'
import { BalanceActions } from './actionTypes'

const helper = new Helper()

async function fetchTokens() {
    try {
        let rawBalance = await helper
            .getContractHelper()
            .getWrappers()
            .token()
            .balanceOf(helper.getWeb3().eth.defaultAccount)
        return helper.formatEther(rawBalance.toString())
    } catch (err) {
        console.log('Error retrieving token balance', err.message)
    }
}

export const getTokenBalance = createAction(
    BalanceActions.GET_TOKENS,
    fetchTokens
)
