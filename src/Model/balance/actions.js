import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import BigNumber from 'bignumber.js'
import { units } from 'ethereum-units'
import { ThorConnection } from '../../Web3/ThorConnection'

const helper = new Helper()

async function fetchTokens() {
    try {
        let address = await fetchPublicAddress()
        let rawResult = await ThorConnection.contractFactory()
                                            .decentBetTokenContract
                                            .balanceOf(address)
        return new BigNumber(rawResult).dividedBy(units.ether).toNumber()
    } catch (err) {
        console.log('Error retrieving token balance', err)
    }
}

async function executeDepositTokens(amount) {
    try {
        let txHash = await ThorConnection.contractFactory()
                                            .bettingProviderContract
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
        let txHash = await ThorConnection.contractFactory()
                                         .bettingProviderContract
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
    let bettingProvider = ThorConnection.contractFactory()
                                        .bettingProviderContract
                                        .options
                                        .address
    try {
        let txHash = await ThorConnection.contractFactory()
                                        .decentBetTokenContract
                                        .approve(bettingProvider, amount)
        helper.toggleSnackbar('Successfully sent approve transaction')
        let txHash2 = await executeDepositTokens(amount)
        return [txHash, txHash2]
    } catch (err) {
        console.log('Error approving dbets', err.message)
        helper.toggleSnackbar('Error sending approve transaction')
    }
}

async function fetchPublicAddress() {
    return Promise.resolve(ThorConnection.getDefaultAccount())
}

async function faucet() {
    try {
        let tx = await ThorConnection.contractFactory()
                                     .decentBetTokenContract
                                     .faucet()

        console.log('Sent faucet tx', tx)
        helper.toggleSnackbar('Successfully sent faucet transaction')
        return tx
    } catch (err) {
        helper.toggleSnackbar('Error sending faucet transaction')
        console.log('Error sending faucet tx', err)
    }
}

// Get Total Ether.
async function fetchEtherBalance() {
    try {
        let address = await fetchPublicAddress()
        let rawAmount = await ThorConnection.thor().eth.getBalance(address)
        return new BigNumber(rawAmount).dividedBy(units.ether)
    } catch (err) {
        console.log('error retrieving ether balance')
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
