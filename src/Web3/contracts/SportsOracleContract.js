
import BaseContract from './BaseContract'

export default class SportsOracleContract extends BaseContract {
    /**
     * Getters
     */
    getOwner() {
        return this.instance.methods.owner().call()
    }

    getBalance() {
        return this.getBalance(this.instance.options.address)
    }

    getGameUpdateCost() {
        return this.instance.methods.gameUpdateCost().call()
    }

    getProviderAcceptanceCost() {
        return this.instance.methods.providerAcceptanceCost().call()
    }

    getPayForProviderAcceptance() {
        return this.instance.methods.payForProviderAcceptance().call()
    }

    getAuthorizedAddresses(index) {
        return this.instance.methods.authorizedAddresses(index).call()
    }

    getRequestedProviderAddresses(index) {
        return this.instance.methods.requestedProviderAddresses(index).call()
    }

    getAcceptedProviderAddresses(index) {
        return this.instance.methods.acceptedProviderAddresses(index).call()
    }

    getGamesCount() {
        return this.instance.methods.gamesCount().call()
    }

    getGame(gameId) {
        return this.instance.methods.games(gameId).call()
    }

    getAvailableGamePeriods(gameId, index) {
        return this.instance.availableGamePeriods(gameId, index).call()
    }

    getGameProvidersUpdateList(gameId, index) {
        return this.instance.methods.gameProvidersUpdateList(gameId, index).call()
    }

    getProviderGameToUpdate(gameId, providerAddress) {
        return this.instance.methods.providerGamesToUpdate(gameId, providerAddress).call()
    }

    getGamePeriods(gameId, periodNumber) {
        return this.instance.methods.gamePeriods(gameId, periodNumber).call()
    }

    getTime() {
        return this.instance.methods.getTime().call()
    }

    /**
     * Events
     */
    logNewAuthorizedAddress(fromBlock, toBlock) {
        return this.instance.events.LogNewAuthorizedAddress({}, {
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }, (error, event) => {
            console.warn('logNewAuthorizedAddress', error, event)
        })
    }

    logNewAcceptedProvider(fromBlock, toBlock) {
        return this.instance.events.LogNewAcceptedProvider({}, {
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

        return this.instance.events.LogGameAdded(options,
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
        return this.instance.events.LogGameDetailsUpdate(options, (error, event) => {
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

        return this.instance.events.LogGameResult(options, (error, event) => {
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
        return this.instance.events.LogUpdatedProviderOutcome(options, (error, event) => {
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
        return this.instance.events.LogWithdrawal(options, (error, event) => {
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
        return this.instance.events.LogNewGameUpdateCost(options, (error, event) => {
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
        return this.instance.events.LogNewProviderAcceptanceCost(options, (error, event) => {
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
        return this.instance.events.LogUpdatedTime(options, (error, event) => {
            console.warn('logUpdatedTime', error, event)
        })
    }
}