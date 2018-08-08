import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'

const helper = new Helper()


async function fetchGameBettorBet(gameId, betId, ...args) {
    let { contractFactory, chanProvider } = args

    try {
        
        let contract = await contractFactory.bettingProviderContract()
        let _bet = await contract.getGameBettorBet(
            gameId,
            chanProvider.web3.eth.defaultAccount,
            betId
        )

        return {
            id: betId,
            gameId: gameId,
            oddsId: _bet[0].toNumber(),
            choice: _bet[1].toNumber(),
            amount: _bet[2].div(ethUnits.units.ether).toNumber(),
            blockTime: _bet[3].toNumber(),
            session: _bet[4].toNumber(),
            claimed: _bet[5],
            exists: _bet[6]
        }
    } catch (err) {
        console.log('Error retrieving game bet', gameId, betId, err.message)
    }
}

async function fetchBetReturns(gameId, betId, ...args) {
    let { contractFactory, chanProvider } = args

    try {
        let contract = await contractFactory.bettingProviderContract()
        return contract.getBetReturns(
            gameId,
            betId,
            chanProvider.web3.eth.defaultAccount
        )
    } catch (err) {}
}

async function fetchGameBettorBetOdds(gameId, betId, ...args) {
    let { contractFactory, chanProvider } = args
    let contract = await contractFactory.bettingProviderContract()
    let odds = await contract.getGameBettorBetOdds(
        gameId,
        chanProvider.web3.eth.defaultAccount,
        betId
    )
    odds = {
        betType: odds[0].toNumber(),
        period: odds[1].toNumber(),
        handicap: odds[2].toNumber(),
        team1: odds[3].toNumber(),
        team2: odds[4].toNumber(),
        draw: odds[5].toNumber(),
        points: odds[6].toNumber(),
        over: odds[7].toNumber(),
        under: odds[8].toNumber(),
        isTeam1: odds[9]
    }
    return odds
}

async function fetchUserBets(...args) {
    let iterator = 0
    let iterate = true
    let placedBets = {}
    let { contractFactory, chanProvider } = args
    while (iterate) {
        try {
            let contract = await contractFactory.bettingProviderContract()
            let bets = await contract.getUserBets(
                chanProvider.web3.eth.defaultAccount,
                iterator
            )

            let gameId = bets[0].toNumber()
            let betId = bets[1].toNumber()
            let exists = bets[2]

            if (exists) {
                if (!placedBets.hasOwnProperty(gameId)) {
                    placedBets[gameId] = {}
                }
                let placedBet = await fetchGameBettorBet(gameId, betId)

                // These methods seem to do nothing.
                placedBet.odds = await fetchGameBettorBetOdds(gameId, betId)
                placedBet.returns = await fetchBetReturns(gameId, betId)

                placedBets[gameId][betId] = placedBet
            }
        } catch (err) {
            iterate = false
        }
        iterator++
    }

    return placedBets
}

async function putBet(gameId, oddsId, betType, betAmount, betChoice, ...args) {
    const parsedAmount = new BigNumber(betAmount)
        .times(ethUnits.units.ether)
        .toFixed()
        let { contractFactory } = args

    try {
        let contract = await contractFactory.bettingProviderContract()
        let txHash = await contract.placeBet(
            gameId,
            oddsId,
            betType,
            betChoice,
            parsedAmount
        )
        helper.toggleSnackbar(
            `Successfully sent place bet transaction: ${txHash}`
        )
        return txHash
    } catch (err) {
        console.log('Error placing bet', err.message)
        helper.toggleSnackbar('Error sending place bet transaction')
    }
}

async function executeClaimBet(gameId, betId, ...args) {
    let { factory, chanProvider } = args

    try {
        let contract = await factory.bettingProviderContract()
        let txHash = contract.claimBet(
            gameId,
            betId,
            chanProvider.web3.eth.defaultAccount
        )

        helper.toggleSnackbar('Successfully sent claim bet transaction')
        return txHash
    } catch (err) {
        console.log('Error sending claim bet tx', err.message)
        helper.toggleSnackbar('Error sending claim bet transaction')
    }
}

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [Prefix]: {
        [Actions.SET_BET]: putBet,
        [Actions.GET_USER_BETS]: fetchUserBets,
        [Actions.CLAIM_BET]: [
            executeClaimBet,
            (gameId, betId) => ({
                gameId,
                betId
            })
        ]
    }
})
