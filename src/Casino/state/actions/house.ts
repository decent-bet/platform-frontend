import { createActions } from 'redux-actions'
import axios from 'axios'
import Actions, { PREFIX } from '../actionTypes'
import BigNumber from 'bignumber.js'
import { HOUSE_BALANCE_API_URL } from '../../../config'
import ContractFactory from '../../../common/ContractFactory'
import { units } from 'ethereum-units'

const axiosInstance = axios.create({
    baseURL: HOUSE_BALANCE_API_URL
})

interface IMonthlyBalance {
    month: number
    year: number
    winnings?: string
}

async function fetchHouseMonthlyBalance() {
    let winnings = new BigNumber(0) // Default Value
    try {
        const result = await axiosInstance.get<IMonthlyBalance>('/balance')
        if (result.data.winnings) {
            // Bignumber does not like the commas
            const unparsedWinnings = result.data.winnings.replace(',', '')
            winnings = new BigNumber(unparsedWinnings, 10)
        }
    } catch (error) {
        console.error(error)
    }
    return winnings
}

async function fetchHouseBalance(contractFactory: ContractFactory) {
    const contract = await contractFactory.slotsChannelManagerContract()
    const address = contract.instance._address
    const rawBalance = await contract.instance.methods.balanceOf(address).call()
    const parsedBalance = new BigNumber(rawBalance).dividedBy(units.ether)
    return parsedBalance
}

async function fetchHouseInitialDeposits(contractFactory: ContractFactory) {
    const contract = await contractFactory.slotsChannelManagerContract()
    const houseAddress = contract.instance._address
    const events: any[] = await contract.instance.getPastEvents('LogDeposit')
    const totalDeposited: BigNumber = events
        // Get only the deposits done by the contract's address.
        .filter(evt => evt.returnValues._address === houseAddress)
        // Add them
        .reduce((accumulator: BigNumber, evt) => {
            const parsed = new BigNumber(evt.returnValues.amount)
            return accumulator.plus(parsed)
        }, new BigNumber(0))
    return totalDeposited.dividedBy(units.ether)
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_HOUSE_CURRENT_BALANCE]: fetchHouseBalance,
        [Actions.GET_HOUSE_MONTHLY_BALANCE]: fetchHouseMonthlyBalance,
        [Actions.GET_HOUSE_INITIAL_DEPOSITS]: fetchHouseInitialDeposits
    }
})
