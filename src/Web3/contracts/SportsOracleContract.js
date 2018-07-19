import SportsOracleContractJson from '../../../build/contracts/SportsOracle.json'
import AbstractContract from './AbstractContract'

export default class SportsOracleContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     * @param {DecentBetTokenContract} decentBetTokenContract
     */
    constructor(web3, decentBetTokenContract) {
        super(web3, SportsOracleContractJson)
        this.decentBetTokenContract = decentBetTokenContract
    }

    /**
     * Getters
     */
    getOwner() {
        return this.instance.owner()
    }

    getBalance() {
        return this.decentBetTokenContract.balanceOf(this.instance.address)
    }

    getGameUpdateCost() {
        return this.instance.gameUpdateCost()
    }

    getProviderAcceptanceCost() {
        return this.instance.providerAcceptanceCost()
    }

    getPayForProviderAcceptance() {
        return this.instance.payForProviderAcceptance()
    }

    getAuthorizedAddresses(index) {
        return this.instance.authorizedAddresses(index)
    }

    getRequestedProviderAddresses(index) {
        return this.instance.requestedProviderAddresses(index)
    }

    getAcceptedProviderAddresses(index) {
        return this.instance.acceptedProviderAddresses(index)
    }

    getGamesCount() {
        return this.instance.gamesCount()
    }

    getGame(gameId) {
        return this.instance.games(gameId)
    }

    getAvailableGamePeriods(gameId, index) {
        return this.instance.availableGamePeriods(gameId, index)
    }

    getGameProvidersUpdateList(gameId, index) {
        return this.instance.gameProvidersUpdateList(gameId, index)
    }

    getProviderGameToUpdate(gameId, providerAddress) {
        return this.instance.providerGamesToUpdate(gameId, providerAddress)
    }

    getGamePeriods(gameId, periodNumber) {
        return this.instance.gamePeriods(gameId, periodNumber)
    }

    getTime() {
        return this.instance.getTime()
    }

    /**
     * Events
     */
    logNewAuthorizedAddress(fromBlock, toBlock) {
        return this.instance.LogNewAuthorizedAddress({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewAcceptedProvider(fromBlock, toBlock) {
        return this.instance.LogNewAcceptedProvider({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logGameAdded(fromBlock, toBlock) {
        return this.instance.LogGameAdded({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logGameDetailsUpdate(fromBlock, toBlock) {
        return this.instance.LogGameDetailsUpdate({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logGameResult(fromBlock, toBlock) {
        return this.instance.LogGameResult({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedProviderOutcome(fromBlock, toBlock) {
        return this.instance.LogUpdatedProviderOutcome({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logWithdrawal(fromBlock, toBlock) {
        return this.instance.LogWithdrawal({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewGameUpdateCost(fromBlock, toBlock) {
        return this.instance.LogNewGameUpdateCost({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewProviderAcceptanceCost(fromBlock, toBlock) {
        return this.instance.LogNewProviderAcceptanceCost({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedTime(fromBlock, toBlock) {
        return this.instance.LogUpdatedTime({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}