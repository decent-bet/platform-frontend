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
        }, (error, event) => {
            console.warn('logNewAuthorizedAddress', error, event)
        })
    }

    logNewAcceptedProvider(fromBlock, toBlock) {
        return this.contract.events.LogNewAcceptedProvider({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }, (error, event) => {
            console.warn('logNewAcceptedProvider', error, event)
        })
    }

    logGameAdded(fromBlock, toBlock) {

        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }

        return this.contract.events.LogGameAdded(options, 
            (error, event) => {
            console.warn('logGameAdded', error, event)
        })
    }

    logGameDetailsUpdate(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return this.contract.events.LogGameDetailsUpdate(options, (error, event) => {
            console.warn('logGameDetailsUpdate', error, event)
        })
    }

    logGameResult(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }

        return this.contract.events.LogGameResult(options, (error, event) => {
            console.warn('logGameResult', error, event)
        })
    }

    logUpdatedProviderOutcome(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return this.contract.events.LogUpdatedProviderOutcome(options, (error, event) => {
            console.warn('logUpdatedProviderOutcome', error, event)
        })
    }

    logWithdrawal(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return this.contract.events.LogWithdrawal(options, (error, event) => {
            console.warn('logWithdrawal', error, event)
        })
    }

    logNewGameUpdateCost(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return this.contract.events.LogNewGameUpdateCost(options, (error, event) => {
            console.warn('logWithdrawal', error, event)
        })
    }

    logNewProviderAcceptanceCost(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return this.contract.events.LogNewProviderAcceptanceCost(options, (error, event) => {
            console.warn('logNewProviderAcceptanceCost', error, event)
        })
    }

    logUpdatedTime(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return this.contract.events.LogUpdatedTime(options, (error, event) => {
            console.warn('logUpdatedTime', error, event)
        })
    }
}