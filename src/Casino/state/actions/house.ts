import { createActions } from 'redux-actions'
import axios from 'axios'
import Actions, { PREFIX } from '../actionTypes'
import BigNumber from 'bignumber.js'
import { HOUSE_BALANCE_API_URL } from '../../../config'

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
        if (result.data.winnings !== undefined) {
            // Bignumber does not like the commas
            const unparsedWinnings = result.data.winnings.replace(',', '')
            winnings = new BigNumber(unparsedWinnings, 10)
        }
    } catch (error) {
        console.error(error)
    }
    return winnings
}

export default createActions({
    [PREFIX]: {
        [Actions.GET_HOUSE_MONTHLY_BALANCE]: fetchHouseMonthlyBalance
    }
})
