
import BaseContract from './BaseContract'

export default class SportsOracleContract extends BaseContract {
    /**
     * Getters
     */
    async getOwner() {
        return await this.instance.methods.owner().call()
    }

    async getBalance() {
        return await this.getBalance(this.instance.options.address)
    }

    async getGameUpdateCost() {
        return await this.instance.methods.gameUpdateCost().call()
    }

    async getProviderAcceptanceCost() {
        return await this.instance.methods.providerAcceptanceCost().call()
    }

    async getPayForProviderAcceptance() {
        return await this.instance.methods.payForProviderAcceptance().call()
    }

    async getAuthorizedAddresses(index) {
        return await this.instance.methods.authorizedAddresses(index).call()
    }

    async getRequestedProviderAddresses(index) {
        return this.instance.methods.requestedProviderAddresses(index).call()
    }

    async getAcceptedProviderAddresses(index) {
        return await this.instance.methods.acceptedProviderAddresses(index).call()
    }

    async getGamesCount() {
        return await this.instance.methods.gamesCount().call()
    }

    async getGame(gameId) {
        return await this.instance.methods.games(gameId).call()
    }

    async getAvailableGamePeriods(gameId, index) {
        return await this.instance.availableGamePeriods(gameId, index).call()
    }

    async  getGameProvidersUpdateList(gameId, index) {
        return await this.instance.methods.gameProvidersUpdateList(gameId, index).call()
    }

    async getProviderGameToUpdate(gameId, providerAddress) {
        return await this.instance.methods.providerGamesToUpdate(gameId, providerAddress).call()
    }

    async getGamePeriods(gameId, periodNumber) {
        return await this.instance.methods.gamePeriods(gameId, periodNumber).call()
    }

    async getTime() {
        return await this.instance.methods.getTime().call()
    }

    /**
     * Events
     */
    async logNewAuthorizedAddress(fromBlock, toBlock) {
        return await this.getPastEvents('LogNewAuthorizedAddress', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logNewAcceptedProvider(fromBlock, toBlock) {
        return await this.getPastEvents('LogNewAcceptedProvider', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logGameAdded(fromBlock, toBlock) {

        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }

        return await this.getPastEvents('LogGameAdded', options)
    }

    async logGameDetailsUpdate(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return await this.getPastEvents('LogGameDetailsUpdate', options)
    }

    async logGameResult(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }

        return await this.getPastEvents('LogGameResult', options)
    }

    async logUpdatedProviderOutcome(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return await this.getPastEvents('LogUpdatedProviderOutcome', options)
    }

    async logWithdrawal(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return await this.getPastEvents('LogWithdrawal',options)
    }

    async logNewGameUpdateCost(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return await this.getPastEvents('LogNewGameUpdateCost',options)
    }

    async logNewProviderAcceptanceCost(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return await this.getPastEvents('LogNewProviderAcceptanceCost',options)
    }

    async logUpdatedTime(fromBlock, toBlock) {
        let options = {
            filter: {
            },
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        }
        return await this.getPastEvents('LogUpdatedTime', options)
    }
}