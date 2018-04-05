import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import { BettingProviderActions } from '../actionTypes'

const helper = new Helper()

async function fetchGamesCount() {
    try {
        let result = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getGamesCount()
        return result.toNumber()
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
        let result = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .balanceOf(helper.getWeb3().eth.defaultAccount, session)
        return helper.formatEther(result)
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

async function fetchTokenBalance() {
    try {
        let address = helper.getContractHelper().getBettingProviderInstance()
            .address
        let result = await helper
            .getContractHelper()
            .getWrappers()
            .token()
            .balanceOf(address)
        return helper.formatEther(result)
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
        let result = await helper
            .getContractHelper()
            .getWrappers()
            .token()
            .allowance(address, bettingProvider)
        return result.toNumber()
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

async function fetchAddress() {
    return Promise.resolve(
        helper.getContractHelper().getBettingProviderInstance().address
    )
}

// Functions of this object are the Action Keys "inCamelCase"
// See 'redux-actions' for details
export default createActions({
    [BettingProviderActions.GAMES_COUNT]: fetchGamesCount,
    [BettingProviderActions.DEPOSITED_TOKENS]: fetchDepositedTokens,
    [BettingProviderActions.TOKEN_BALANCE]: fetchTokenBalance,
    [BettingProviderActions.ALLOWANCE]: fetchAllowance,
    [BettingProviderActions.HOUSE_ADDRESS]: fetchHouseAddress,
    [BettingProviderActions.SPORTSORACLE_ADDRESS]: fetchSportsOracleAddress,
    [BettingProviderActions.CURRENT_SESSION]: fetchCurrentSession,
    [BettingProviderActions.DEPOSITED_TOKENS]: fetchDepositedTokens,
    [BettingProviderActions.STATS]: fetchSessionStats,
    [BettingProviderActions.TIME]: fetchTime,
    [BettingProviderActions.ADDRESS]: fetchAddress
})
