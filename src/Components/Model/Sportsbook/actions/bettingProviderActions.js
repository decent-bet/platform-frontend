import Helper from '../../../Helper'
import { createAction } from 'redux-actions'
import { BettingProviderActions } from '../actionTypes'

const helper = new Helper()

async function fetchGamesCount() {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getGamesCount()
    } catch (err) {
        console.log(
            'Error retrieving games count for the provider',
            err.message
        )
    }
}

async function fetchCurrentSession() {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getCurrentSession()
    } catch (err) {
        console.log('Error retrieving current session', err.message)
    }
}

async function fetchDepositedTokens() {
    try {
        let session = await fetchCurrentSession()
        return helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .balanceOf(helper.getWeb3().eth.defaultAccount, session)
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

async function fetchTokenBalance() {
    try {
        let address = helper.getContractHelper().getBettingProviderInstance()
            .address
        return helper
            .getContractHelper()
            .getWrappers()
            .token()
            .balanceOf(address)
    } catch (err) {
        console.log('Error retrieving token balance', err.message)
    }
}

async function fetchAllowance() {
    try {
        const address = helper.getWeb3().eth.defaultAccount
        const bettingProvider = helper
            .getContractHelper()
            .getBettingProviderInstance().address
        return helper
            .getContractHelper()
            .getWrappers()
            .token()
            .allowance(address, bettingProvider)
    } catch (err) {
        console.log('Error retrieving allowance', err.message)
    }
}

async function fetchHouseAddress() {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getHouseAddress()
    } catch (err) {
        console.log('Error retrieving house address', err.message)
    }
}

async function fetchSportsOracleAddress() {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getSportsOracleAddress()
    } catch (err) {
        console.log('Error retrieving sports oracle address', err.message)
    }
}

async function fetchSessionStats(session) {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getSessionStats(session)
    } catch (err) {
        console.log('Error retrieving session stats', err.message)
    }
}

async function fetchTime() {
    let time = await helper
        .getContractHelper()
        .getWrappers()
        .bettingProvider()
        .getTime()
    return time.toNumber()
}

export const getGamesCount = createAction(
    BettingProviderActions.GAMES_COUNT,
    fetchGamesCount
)
export const getDepositedTokens = createAction(
    BettingProviderActions.DEPOSITED_TOKENS,
    fetchDepositedTokens
)
export const getTokenBalance = createAction(
    BettingProviderActions.TOKEN_BALANCE,
    fetchTokenBalance
)
export const getAllowance = createAction(
    BettingProviderActions.ALLOWANCE,
    fetchAllowance
)
export const getHouseAddress = createAction(
    BettingProviderActions.HOUSE_ADDRESS,
    fetchHouseAddress
)
export const getSportsOracleAddress = createAction(
    BettingProviderActions.SPORTSORACLE_ADDRESS,
    fetchSportsOracleAddress
)
export const getCurrentSession = createAction(
    BettingProviderActions.CURRENT_SESSION,
    fetchCurrentSession
)
export const getCurrentSessionDepositedTokens = createAction(
    BettingProviderActions.DEPOSITED_TOKENS,
    fetchDepositedTokens
)
export const getSessionStats = createAction(
    BettingProviderActions.STATS,
    fetchSessionStats
)
export const getTime = createAction(BettingProviderActions.TIME, fetchTime)

export function getAddress() {
    return {
        type: BettingProviderActions.ADDRESS,
        payload: Promise.resolve(
            helper.getContractHelper().getBettingProviderInstance().address
        )
    }
}
