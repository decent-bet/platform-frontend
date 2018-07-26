import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'

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
        return result
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

async function fetchTokenBalance() {
    try {
        let address = helper.getContractHelper().getBettingProviderInstance().options.address
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
            .getBettingProviderInstance().options.address
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
        helper.getContractHelper().getBettingProviderInstance().options.address
    )
}

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [Prefix]: {
        [Actions.GET_GAMES_COUNT]: fetchGamesCount,
        [Actions.GET_DEPOSITED_TOKENS]: fetchDepositedTokens,
        [Actions.GET_TOKEN_BALANCE]: fetchTokenBalance,
        [Actions.GET_ALLOWANCE]: fetchAllowance,
        [Actions.GET_HOUSE_ADDRESS]: fetchHouseAddress,
        [Actions.GET_SPORTSORACLE_ADDRESS]: fetchSportsOracleAddress,
        [Actions.GET_CURRENT_SESSION]: fetchCurrentSession,
        [Actions.GET_STATS]: fetchSessionStats,
        [Actions.GET_TIME]: fetchTime,
        [Actions.GET_ADDRESS]: fetchAddress,

        [Actions.SET_TIME]: time => time
    }
})
