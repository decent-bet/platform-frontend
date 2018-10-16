import { createActions } from 'redux-actions'
import Actions, { PREFIX } from '../actionTypes'
import { Wallet } from 'ethers'
import { IKeyHandler } from '../../../common/types'
import { MNEMONIC_DPATH } from '../../../constants'
import BigNumber from 'bignumber.js'
import { units } from 'ethereum-units'

async function getCasinoLoginStatus(keyHandler: IKeyHandler): Promise<boolean> {
    let address = await keyHandler.getPublicAddress()
    if (address) {
        return true
    }

    return false
}

function comparePublicAddress(walletAddress: string, vetAddress: string) {
    if (walletAddress !== vetAddress) {
        throw new Error(
            'Public address derived from the private key, is not valid for the user account'
        )
    }
}

function authWallet(data: string, account: any, keyHandler: IKeyHandler) {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !account ||
                !account.verification ||
                !account.verification.addressRegistration ||
                !account.verification.addressRegistration.vetAddress
            ) {
                throw new Error(
                    `You don't have a VET address registered, please go to the account section.`
                )
            }

            let acccountVetAddress =
                account.verification.addressRegistration.vetAddress
            if (data.includes(' ')) {
                // Passphrase Mnemonic mode
                const wallet = Wallet.fromMnemonic(data, MNEMONIC_DPATH)
                comparePublicAddress(wallet.address, acccountVetAddress)
                await keyHandler.setupWallet(
                    wallet.privateKey,
                    wallet.address,
                    data
                )
            } else {
                // Private Key Mode
                // Adds '0x' to the beginning of the key if it is not there.
                if (data.substring(0, 2) !== '0x') {
                    data = '0x' + data
                }
                const wallet = new Wallet(data)
                comparePublicAddress(wallet.address, acccountVetAddress)
                await keyHandler.setupWallet(wallet.privateKey, wallet.address)
            }

            resolve(true)
        } catch (error) {
            reject({
                message: error.message
            })
        }
    })
}

async function faucet(contractFactory): Promise<any> {
    let contract = await contractFactory.decentBetTokenContract()
    let tx = await contract.faucet()
    return tx
}

export async function fetchTokens(contractFactory, helper, keyHandler) {
    try {
        let address = keyHandler.getAddress()
        let contract = await contractFactory.decentBetTokenContract()

        let rawResult = await contract.balanceOf(address)
        let tokens = new BigNumber(rawResult).dividedBy(units.ether).toNumber()
        return tokens
    } catch (err) {
        return 0
        // helper.toggleSnackbar('Error retrieving token balance')
        console.log('Error retrieving token balance', err)
    }
}

export async function executeDepositTokens(amount, contractFactory) {
    try {
        let contract = await contractFactory.bettingProviderContract()

        let txHash = await contract.deposit(amount)
        // let msg = `Successfully sent deposit transaction: ${txHash}`
        // helper.toggleSnackbar(msg)
        return txHash
    } catch (err) {
        console.log('Error depositing tokens', err.message)
        // helper.toggleSnackbar('Error sending deposit transaction')
    }
}

export async function executeWithdrawTokens(
    amount,
    session,
    { contractFactory, helper }
) {
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

export async function executeApproveAndDepositTokens(
    amount,
    contractFactory,
    helper
) {
    let bettingProviderContract = await contractFactory.bettingProviderContract()
    let bettingProvider = bettingProviderContract.options.address

    try {
        let decentBetTokenContract = await contractFactory.decentBetTokenContract()
        let txHash = await decentBetTokenContract.approve(
            bettingProvider,
            amount
        )
        helper.toggleSnackbar('Successfully sent approve transaction')
        let txHash2 = await executeDepositTokens(amount, contractFactory)
        return [txHash, txHash2]
    } catch (err) {
        return []
        // console.log('Error approving dbets', err.message)
        // helper.toggleSnackbar('Error sending approve transaction')
    }
}

export async function fetchEtherBalance(contractFactory, keyHandler) {
    try {
        let address = keyHandler.getAddress()
        let contract = await contractFactory.decentBetTokenContract()
        let rawAmount = await contract.getBalance(address)
        let balance = new BigNumber(rawAmount).dividedBy(units.ether)
        return balance
    } catch (error) {
        return 0
        // helper.toggleSnackbar('Error retrieving ether balance')
        console.log('error retrieving ether balance', error)
    }
}

export default createActions({
    [PREFIX]: {
        [Actions.AUTH_WALLET]: authWallet,
        [Actions.GET_CASINO_LOGIN_STATUS]: getCasinoLoginStatus,
        [Actions.GET_TOKENS]: fetchTokens,
        [Actions.FAUCET]: faucet,
        [Actions.GET_ETHER_BALANCE]: fetchEtherBalance,
        [Actions.WITHDRAW_TOKENS]: executeWithdrawTokens,
        [Actions.DEPOSIT_TOKENS]: executeDepositTokens,
        [Actions.APPROVE_AND_DEPOSIT_TOKENS]: executeApproveAndDepositTokens
    }
})
