import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'

const helper = new Helper()

async function fetchGamesCount({ contractFactory }) {
    try {
        let contract = await contractFactory.bettingProviderContract()
        let result = await contract.getGamesCount()
        return result.toNumber()
    } catch (err) {
        console.log(
            'Error retrieving games count for the provider',
            err.message
        )
    }
}

async function fetchCurrentSession({ contractFactory }) {
    try {
        let contract = await contractFactory.bettingProviderContract()
        return await contract.getCurrentSession()
    } catch (err) {
        console.log('Error retrieving current session', err.message)
    }
}

async function fetchDepositedTokens(chainProvider) {
    let { contractFactory } = chainProvider

    try {
        let session = await fetchCurrentSession(chainProvider)
        let contract = await contractFactory.bettingProviderContract()
        let result = await contract.balanceOf(
            chainProvider.web3.eth.defaultAccount,
            session
        )
        return result
    } catch (err) {
        console.log('Error retrieving balance', err.message)
    }
}

async function fetchTokenBalance({ contractFactory }) {
    try {
        let tokenContract = await contractFactory.decentBetTokenContract()
        let bettingContract = await contractFactory.bettingProviderContract()
        let result = await tokenContract.balanceOf(bettingContract.instance.options.address)
        return helper.formatEther(result)
    } catch (err) {
        console.log('Error retrieving token balance', err.message)
    }
}

async function fetchAllowance(chainProvider) {
    let { contractFactory } = chainProvider
    try {
        let tokenContract = await contractFactory.decentBetTokenContract
        const address = chainProvider.web3.eth.defaultAccount
        let bettingContract = await contractFactory.bettingProviderContract()

        let result = await tokenContract.allowance(address, bettingContract.instance.options.address)
        return result.toNumber()
    } catch (err) {
        console.log('Error retrieving allowance', err.message)
    }
}

async function fetchHouseAddress({ contractFactory }) {
    try {
        let contract = await contractFactory.bettingProviderContract()
        return await contract.getHouseAddress()
    } catch (err) {
        console.log('Error retrieving house address', err.message)
    }
}

async function fetchSportsOracleAddress({ contractFactory }) {
    try {
        let contract = await contractFactory.getBettingProviderContract()
        return await contract.getSportsOracleAddress()
    } catch (err) {
        console.log('Error retrieving sports oracle address', err.message)
    }
}

async function fetchSessionStats(session, { contractFactory }) {
    try {
        let contract = await contractFactory.bettingProviderContract()
        return await contract.getSessionStats(session)
    } catch (err) {
        console.log('Error retrieving session stats', err.message)
    }
}

async function fetchTime({ contractFactory }) {
    let contract = await contractFactory.bettingProviderContract()
    let time = await contract.getTime()
    return time.toNumber()
}

async function fetchAddress({ contractFactory }) {
    let contract = contractFactory.bettingProviderContract()
    return await contract.instance.options.address
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
