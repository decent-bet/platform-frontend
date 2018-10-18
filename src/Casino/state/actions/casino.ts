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

async function setSlotsInitialized(): Promise<boolean> {
    return true
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

// Get the current session balance
function fetchBalance(contractFactory, vetAddress): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let slotsContract = await contractFactory.slotsChannelManagerContract()
            let balance = await slotsContract.balanceOf(vetAddress)
            balance = balance || 0
            resolve(parseFloat(balance).toFixed())
        } catch (err) {
            console.log(err)
            reject({ message: 'Error retrieving the balance' })
        }
    })
}

// Get Total Ether.
export function fetchVTHOBalance(contractFactory, vetAddress): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await contractFactory.decentBetTokenContract()
            const rawAmount = await contract.getBalance(vetAddress)
            const balance = new BigNumber(rawAmount).dividedBy(units.ether)
            resolve(balance)
        } catch (error) {
            reject({ message: error.message })
        }
    })
}

export function fetchTokens(contractFactory, vetAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            let contract = await contractFactory.decentBetTokenContract()
            let rawResult = await contract.balanceOf(vetAddress)
            let tokens = new BigNumber(rawResult)
                .dividedBy(units.ether)
                .toNumber()
            resolve(tokens)
        } catch (err) {
            reject({ message: 'Error retrieving token balance' })
        }
    })
}

function faucet(contractFactory, accountAddress): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let contract = await contractFactory.decentBetTokenContract()
            const tx = await contract.faucet(accountAddress)
            resolve(tx)
        } catch {
            reject({ message: 'Error processing the Faucet' })
        }
    })
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

export default createActions({
    [PREFIX]: {
        [Actions.AUTH_WALLET]: authWallet,
        [Actions.GET_CASINO_LOGIN_STATUS]: getCasinoLoginStatus,
        [Actions.FAUCET]: faucet,
        [Actions.SET_SLOTS_INITIALIZED]: setSlotsInitialized,
        [Actions.GET_TOKENS]: fetchTokens,
        [Actions.GET_VTHO_BALANCE]: fetchVTHOBalance,
        [Actions.GET_BALANCE]: fetchBalance,
        [Actions.WITHDRAW_TOKENS]: executeWithdrawTokens,
        [Actions.DEPOSIT_TOKENS]: executeDepositTokens,
        [Actions.APPROVE_AND_DEPOSIT_TOKENS]: executeApproveAndDepositTokens
    }
})
