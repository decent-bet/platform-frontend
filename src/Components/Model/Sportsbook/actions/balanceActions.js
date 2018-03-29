import Helper from '../../../Helper'
import { createAction } from 'redux-actions'
import { BalanceActions } from '../actionTypes'

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

async function executeDepositTokens(amount) {
    try {
        let txHash = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .deposit(amount)
        let msg = `Successfully sent deposit transaction: ${txHash}`
        helper.toggleSnackbar(msg)
        return txHash
    } catch (err) {
        console.log('Error depositing tokens', err.message)
        helper.toggleSnackbar('Error sending deposit transaction')
    }
}

async function executeWithdrawTokens(amount, session) {
    try {
        let txHash = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .withdraw(amount, session)
        let msg = `Successfully sent withdraw transaction ${txHash}`
        helper.toggleSnackbar(msg)
        return txHash
    } catch (err) {
        console.log('Error withdrawing tokens', err.message)
        helper.toggleSnackbar('Error sending withdraw transaction')
    }
}

async function executeApproveAndDepositTokens(amount) {
    let bettingProvider = helper
        .getContractHelper()
        .getBettingProviderInstance().address
    try {
        let txHash = await helper
            .getContractHelper()
            .getWrappers()
            .token()
            .approve(bettingProvider, amount)
        helper.toggleSnackbar('Successfully sent approve transaction')
        let txHash2 = await executeDepositTokens(amount)
        return [txHash, txHash2]
    } catch (err) {
        console.log('Error approving dbets', err.message)
        helper.toggleSnackbar('Error sending approve transaction')
    }
}

export const getTokenBalance = createAction(
    BalanceActions.GET_TOKENS,
    fetchTokens
)

export const withdrawTokens = createAction(
    BalanceActions.WITHDRAW_TOKENS,
    executeWithdrawTokens
)

export const depositTokens = createAction(
    BalanceActions.DEPOSIT_TOKENS,
    executeDepositTokens
)

export const approveAndDepositTokens = createAction(
    BalanceActions.APPROVE_AND_DEPOSIT_TOKENS,
    executeApproveAndDepositTokens
)
