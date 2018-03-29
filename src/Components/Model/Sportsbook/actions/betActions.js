import Helper from '../../../Helper'
import { createAction } from 'redux-actions'
import { BettingProviderActions } from '../actionTypes'
import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'

const helper = new Helper()

async function fetchGameBettorBet(gameId, betId) {
    try {
        let _bet = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getGameBettorBet(
                gameId,
                helper.getWeb3().eth.defaultAccount,
                betId
            )

        return {
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

async function fetchBetReturns(gameId, betId) {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .getBetReturns(gameId, betId, helper.getWeb3().eth.defaultAccount)
    } catch (err) {}
}

async function fetchGameBettorBetOdds(gameId, betId) {
    let odds = await helper
        .getContractHelper()
        .getWrappers()
        .bettingProvider()
        .getGameBettorBetOdds(
            gameId,
            helper.getWeb3().eth.defaultAccount,
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

async function fetchUserBets(userId) {
    try {
        let iterate = true
        let placedBets = {}
        while (iterate) {
            let bets = await helper
                .getContractHelper()
                .getWrappers()
                .bettingProvider()
                .getUserBets(helper.getWeb3().eth.defaultAccount, userId)

            let gameId = bets[0].toNumber()
            let betId = bets[1].toNumber()
            let exists = bets[2]

            if (!exists) {
                iterate = false
            } else {
                if (!placedBets.hasOwnProperty(gameId)) {
                    placedBets[gameId] = {}
                }

                let placedBet = await fetchGameBettorBet(gameId, betId)
                placedBets[gameId][placedBet.id] = placedBet

                // These methods seem to do nothing.
                /*
                let odds = await fetchGameBettorBetOdds(gameId, betId)
                let returns = await fetchBetReturns(gameId, betId)
                */
            }

            return placedBets
        }
    } catch (err) {
        console.log('Error retrieving user bets', err.message)
    }
}

async function putBet(gameId, oddsObj) {
    const betAmount = new BigNumber(oddsObj.betAmount)
        .times(ethUnits.units.ether)
        .toFixed()
    const betType = oddsObj.betType
    const selectedChoice = oddsObj.selectedChoice

    try {
        let txHash = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .placeBet(gameId, oddsObj.id, betType, selectedChoice, betAmount)
        helper.toggleSnackbar(
            `Successfully sent place bet transaction: ${txHash}`
        )
        return txHash
    } catch (err) {
        console.log('Error placing bet', err.message)
        helper.toggleSnackbar('Error sending place bet transaction')
    }
}

async function executeClaimBet(gameId, betId) {
    try {
        let txHash = await helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()
            .claimBet(gameId, betId, helper.getWeb3().eth.defaultAccount)

        helper.toggleSnackbar('Successfully sent claim bet transaction')
        return txHash
    } catch (err) {
        console.log('Error sending claim bet tx', err.message)
        helper.toggleSnackbar('Error sending claim bet transaction')
    }
}

export const getUserBets = createAction(
    BettingProviderActions.USER_BETS,
    fetchUserBets
)

export const setBet = createAction(BettingProviderActions.SET_BET, putBet)

export const claimBet = createAction(
    BettingProviderActions.CLAIM_BET,
    executeClaimBet
)
