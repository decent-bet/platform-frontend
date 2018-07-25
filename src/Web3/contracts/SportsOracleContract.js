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
        return this.contract.methods.owner().call()
    }

    getBalance() {
        return this.decentBetTokenContract.balanceOf(this.contract.options.address)
    }

    getGameUpdateCost() {
        return this.contract.methods.gameUpdateCost().call()
    }

    getProviderAcceptanceCost() {
        return this.contract.methods.providerAcceptanceCost().call()
    }

    getPayForProviderAcceptance() {
        return this.contract.methods.payForProviderAcceptance().call()
    }

    getAuthorizedAddresses(index) {
        return this.contract.methods.authorizedAddresses(index).call()
    }

    getRequestedProviderAddresses(index) {
        return this.contract.methods.requestedProviderAddresses(index).call()
    }

    getAcceptedProviderAddresses(index) {
        return this.contract.methods.acceptedProviderAddresses(index).call()
    }

    getGamesCount() {
        return this.contract.methods.gamesCount().call()
    }

    getGame(gameId) {
        return this.contract.methods.games(gameId).call()
    }

    getAvailableGamePeriods(gameId, index) {
        return this.contract.availableGamePeriods(gameId, index).call()
    }

    getGameProvidersUpdateList(gameId, index) {
        return this.contract.methods.gameProvidersUpdateList(gameId, index).call()
    }

    getProviderGameToUpdate(gameId, providerAddress) {
        return this.contract.methods.providerGamesToUpdate(gameId, providerAddress).call()
    }

    getGamePeriods(gameId, periodNumber) {
        return this.contract.methods.gamePeriods(gameId, periodNumber).call()
    }

    getTime() {
        return this.contract.methods.getTime().call()
    }

    /**
     * Events
     */
    logNewAuthorizedAddress(fromBlock, toBlock) {
        return this.contract.events.LogNewAuthorizedAddress({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewAcceptedProvider(fromBlock, toBlock) {
        return this.contract.events.LogNewAcceptedProvider({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logGameAdded(fromBlock, toBlock) {
        return this.contract.events.LogGameAdded({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logGameDetailsUpdate(fromBlock, toBlock) {
        return this.contract.events.LogGameDetailsUpdate({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logGameResult(fromBlock, toBlock) {
        return this.contract.events.LogGameResult({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedProviderOutcome(fromBlock, toBlock) {
        return this.contract.events.LogUpdatedProviderOutcome({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logWithdrawal(fromBlock, toBlock) {
        return this.contract.events.LogWithdrawal({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewGameUpdateCost(fromBlock, toBlock) {
        return this.contract.events.LogNewGameUpdateCost({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewProviderAcceptanceCost(fromBlock, toBlock) {
        return this.contract.events.LogNewProviderAcceptanceCost({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedTime(fromBlock, toBlock) {
        return this.contract.events.LogUpdatedTime({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}