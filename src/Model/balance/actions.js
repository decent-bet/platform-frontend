import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import BigNumber from 'bignumber.js'
import { units } from 'ethereum-units'

export async function fetchTokens(chainProvider, helper, keyHandler) {
    try {
        let { contractFactory } = chainProvider
        let address = keyHandler.getAddress()
        let contract = await contractFactory.decentBetTokenContract()

        let rawResult = await contract.balanceOf(address)
        let tokens = new BigNumber(rawResult)
                                .dividedBy(units.ether)
                                .toNumber()
        return tokens
    } catch (err) {
        helper.toggleSnackbar('Error retrieving token balance')
        console.log('Error retrieving token balance', err)
    }
}

export async function executeDepositTokens(amount, chainProvider, helper) {
    try {
        let { contractFactory } = chainProvider
        let contract = await contractFactory.bettingProviderContract()

        let txHash = await contract.deposit(amount)
        let msg = `Successfully sent deposit transaction: ${txHash}`
        helper.toggleSnackbar(msg)
        return txHash
    } catch (err) {
        console.log('Error depositing tokens', err.message)
        helper.toggleSnackbar('Error sending deposit transaction')
    }
}

export async function executeWithdrawTokens(amount, session, { contractFactory }) {
    try {
        let contract = await contractFactory.bettingProviderContract()
        let txHash = await contract.withdraw(amount, session)
        let msg = `Successfully sent withdraw transaction ${txHash}`
        helper.toggleSnackbar(msg)
        return txHash
    } catch (err) {
        console.log('Error withdrawing tokens', err.message)
        helper.toggleSnackbar('Error sending withdraw transaction')
    }
}

export async function executeApproveAndDepositTokens(amount, chainProvider, helper) {
        let { contractFactory } = chainProvider
        let bettingProviderContract = await contractFactory.bettingProviderContract()
        let bettingProvider = bettingProviderContract.options.address

        try {
            let decentBetTokenContract = await contractFactory.decentBetTokenContract()
            let txHash = await decentBetTokenContract.approve(
                bettingProvider,
                amount
            )
            helper.toggleSnackbar('Successfully sent approve transaction')
            let txHash2 = await executeDepositTokens(amount, chainProvider, helper)
            return [txHash, txHash2]
        } catch (err) {
            console.log('Error approving dbets', err.message)
            helper.toggleSnackbar('Error sending approve transaction')
        }
}

export async function fetchPublicAddress(keyHandler) {
    return keyHandler.getAddress()
}

export async function faucet(contractFactory, helper) {
    helper.toggleSnackbar('Sending faucet transaction')
    try {
        let contract = await contractFactory.decentBetTokenContract()
        let tx = await contract.faucet()

        console.log('Sent faucet tx', tx)
        helper.toggleSnackbar('Successfully sent faucet transaction')
        return tx
    } catch (err) {
        helper.toggleSnackbar('Error sending faucet transaction')
        console.log('Error sending faucet tx', err)
    }
}

// Get Total Ether.
export async function fetchEtherBalance(chainProvider, helper, keyHandler) {
    try {
        let address = keyHandler.getAddress()
        let contract = await chainProvider.contractFactory.decentBetTokenContract()
        let rawAmount = await contract.getBalance(address)
        let balance = new BigNumber(rawAmount).dividedBy(units.ether)
        return balance
    } catch (error) {
        helper.toggleSnackbar('Error retrieving ether balance')
        console.log('error retrieving ether balance', error)
    }
}


// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [Prefix]: {
        [Actions.GET_PUBLIC_ADDRESS]: fetchPublicAddress,
        [Actions.GET_TOKENS]: fetchTokens,
        [Actions.GET_ETHER_BALANCE]: fetchEtherBalance,
        [Actions.WITHDRAW_TOKENS]: executeWithdrawTokens,
        [Actions.DEPOSIT_TOKENS]: executeDepositTokens,
        [Actions.APPROVE_AND_DEPOSIT_TOKENS]: executeApproveAndDepositTokens,
        [Actions.FAUCET]: faucet
    }
})
