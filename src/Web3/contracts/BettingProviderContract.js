import ethAbi from 'web3-eth-abi'
import BaseContract from './BaseContract'

export default class BettingProviderContract extends BaseContract {
    /**
     * Getters
     */
    async getGamesCount() {
        return await this.instance.methods.gamesCount().call()
    }

    /**
     * 
     * @param {string} id 
     */
    async getGame(id) {
        return await this.instance.methods.getGame(id).call()
    }

    async getGamePeriodBetLimits(id, period) {
        return await this.instance.methods.getGamePeriodBetLimits(id, period).call()
    }

    async getGameMaxBetLimit(id) {
        return await this.instance.methods.getGameMaxBetLimit(id).call()
    }

    async getGameBettor(id, index) {
        return await this.instance.methods.getGameBettor(id, index).call()
    }

    async getGameBettorBet(id, address, betId) {
        return await this.instance.methods.getGameBettorBet(id, address, betId).call()
    }

    async getGameBettorBetOdds(id, address, betId) {
        return await this.instance.methods.getGameBettorBetOdds(id, address, betId).call()
    }

    async getGameBettorBetOddsDetails(id, address, betId) {
        return await this.instance.methods.getGameBettorBetOddsDetails(id, address, betId).call()
    }

    async getGameOddsCount(id) {
        return await this.instance.methods.getGameOddsCount(id).call()
    }

    async getGameOdds(id, oddsId) {
        return await this.instance.methods.getGameOdds(id, oddsId).call()
    }

    async getGameOddsDetails(id, oddsId) {
        return await this.instance.methods.getGameOddsDetails(id, oddsId).call()
    }

    async getGameOutcome(id, period) {
        return await this.instance.methods.getGameOutcome(id, period).call()
    }

    async getDepositedTokens(address, sessionNumber) {
        return await this.instance.methods.depositedTokens(address, sessionNumber).call()
    }

    async getSessionStats(sessionNumber) {
        return await this.instance.methods.sessionStats(sessionNumber).call()
    }

    async getSportsOracleAddress() {
        return await this.instance.methods.sportsOracleAddress().call()
    }

    async getHouseAddress() {
        return await this.instance.methods.houseAddress().call()
    }

    async getCurrentSession() {
        return await this.instance.methods.currentSession().call()
    }

    async getTime() {
        return await this.instance.methods.getTime().call()
    }

    async getUserBets(address, index) {
        return await this.instance.methods.getUserBets(address, index).call()
    }

    async getBetReturns(gameId, betId, bettor) {
        return await this.instance.methods.getBetReturns(gameId, betId, bettor).call()
    }

    async balanceOf(address, session) {
        console.log(
            'Retrieving sportsbook balance for',
            address,
            session
        )
        return await this.instance.methods.balanceOf(address, session).call()
    }

    /**
     * Setters
     */
    async deposit(amount) {
        console.log(
            'Depositing',
            amount,
            'to sportsbook as',
            this.web3.eth.defaultAccount
        )

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'deposit',
            type: 'function',
            inputs: [{
                name: 'amount',
                type: 'uint256'
            }]
        }, [amount])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async withdraw(amount, session) {
        console.log(
            'Withdraw',
            amount,
            'from sportsbook as',
            this.web3.eth.defaultAccount
        )

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'withdraw',
            type: 'function',
            inputs: [{
                name: 'amount',
                type: 'uint256'
            },
            {
                name: 'session',
                type: 'uint256'
            }
            ]
        }, [amount, session])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async setSportsOracle(address) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'setSportsOracle',
            type: 'function',
            inputs: [{
                name: '_address',
                type: 'address'
            }]
        }, [address])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async changeAssistedClaimTimeOffset(offset) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'changeAssistedClaimTimeOffset',
            type: 'function',
            inputs: [{
                name: 'offset',
                type: 'uint256'
            }]
        }, [offset])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    async addGame(oracleGameId, cutOffTime, endTime) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'addGame',
            type: 'function',
            inputs: [{
                name: 'oracleGameId',
                type: 'uint256'
            },
            {
                name: 'cutOffTime',
                type: 'uint256'
            },
            {
                name: 'endTime',
                type: 'uint256'
            }
            ]
        }, [oracleGameId, cutOffTime, endTime])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async updateGamePeriodBetLimits(id, period, limits) {
        console.log(
            'updateGamePeriodBetLimits',
            id,
            period,
            limits
        )

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'updateGamePeriodBetLimits',
            type: 'function',
            inputs: [{
                name: 'gameId',
                type: 'uint256'
            },
            {
                name: 'period',
                type: 'uint256'
            },
            {
                name: 'limits',
                type: 'uint256[4]'
            }
            ]
        }, [id, period, limits])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async pushGameOdds(
        id,
        refId,
        period,
        handicap,
        team1,
        team2,
        draw,
        betType,
        points,
        over,
        under,
        isTeam1
    ) {
        console.log(
            'pushGameOdds params',
            id,
            refId,
            period,
            handicap,
            team1,
            team2,
            draw,
            betType,
            points,
            over,
            under,
            isTeam1
        )

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'pushGameOdds',
            type: 'function',
            inputs: [{
                name: 'id',
                type: 'uint256'
            },
            {
                name: 'refId',
                type: 'string'
            },
            {
                name: 'period',
                type: 'uint256'
            },
            {
                name: 'handicap',
                type: 'int256'
            },
            {
                name: 'team1',
                type: 'int256'
            },
            {
                name: 'team2',
                type: 'int256'
            },
            {
                name: 'draw',
                type: 'int256'
            },
            {
                name: 'betType',
                type: 'uint256'
            },
            {
                name: 'points',
                type: 'uint256'
            },
            {
                name: 'over',
                type: 'int256'
            },
            {
                name: 'under',
                type: 'int256'
            },
            {
                name: 'isTeam1',
                type: 'bool'
            }
            ]
        }, [
                id,
                refId,
                period,
                handicap,
                team1,
                team2,
                draw,
                betType,
                points,
                over,
                under,
                isTeam1
            ])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async updateGameOdds(
        id,
        oddsId,
        betType,
        handicap,
        team1,
        team2,
        draw,
        points,
        over,
        under
    ) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'updateGameOdds',
            type: 'function',
            inputs: [{
                name: 'id',
                type: 'uint256'
            },
            {
                name: 'oddsId',
                type: 'uint256'
            },
            {
                name: 'betType',
                type: 'uint256'
            },
            {
                name: 'handicap',
                type: 'int256'
            },
            {
                name: 'team1',
                type: 'int256'
            },
            {
                name: 'team2',
                type: 'int256'
            },
            {
                name: 'draw',
                type: 'int256'
            },
            {
                name: 'points',
                type: 'uint256'
            },
            {
                name: 'over',
                type: 'int256'
            },
            {
                name: 'under',
                type: 'int256'
            }
            ]
        }, [
                id,
                oddsId,
                betType,
                handicap,
                team1,
                team2,
                draw,
                points,
                over,
                under
            ])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async updateGameOutcome(
        id,
        period,
        result,
        team1Points,
        team2Points
    ) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'updateGameOutcome',
            type: 'function',
            inputs: [{
                name: 'id',
                type: 'uint256'
            },
            {
                name: 'period',
                type: 'uint256'
            },
            {
                name: 'result',
                type: 'int256'
            },
            {
                name: 'team1Points',
                type: 'uint256'
            },
            {
                name: 'team2Points',
                type: 'uint256'
            }
            ]
        }, [id, period, result, team1Points, team2Points])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async placeBet(gameId, oddsId, betType, choice, amount) {
        console.log(
            'Placing bet',
            gameId,
            oddsId,
            betType,
            choice,
            amount
        )

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'placeBet',
            type: 'function',
            inputs: [{
                name: 'gameId',
                type: 'uint256'
            },
            {
                name: 'oddsId',
                type: 'uint256'
            },
            {
                name: 'betType',
                type: 'uint256'
            },
            {
                name: 'choice',
                type: 'uint256'
            },
            {
                name: 'amount',
                type: 'uint256'
            }
            ]
        }, [gameId, oddsId, betType, choice, amount])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async claimBet(gameId, betId, bettor) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'claimBet',
            type: 'function',
            inputs: [{
                name: 'gameId',
                type: 'uint256'
            },
            {
                name: 'betId',
                type: 'uint256'
            },
            {
                name: 'bettor',
                type: 'address'
            }
            ]
        }, [gameId, betId, bettor])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    /**
     * Events
     */
    async logNewGame(fromBlock, toBlock) {
        return await this.getPastEvents('LogNewGame', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logNewGameOdds(fromBlock, toBlock) {
        return await this.getPastEvents('LogNewGameOdds', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logUpdatedGameOdds(fromBlock, toBlock) {
        return await this.getPastEvents('LogUpdatedGameOdds', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logUpdatedMaxBet(fromBlock, toBlock) {
        return await this.getPastEvents('LogUpdatedMaxBet', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logUpdatedBetLimits(fromBlock, toBlock) {
        return await this.getPastEvents('LogUpdatedBetLimits', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logNewBet(fromBlock, toBlock) {
        return await this.getPastEvents('LogNewBet', {
            filter: {},
            bettor: this.web3.eth.defaultAccount,
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logClaimedBet(fromBlock, toBlock) {
        return await this.getPastEvents('LogClaimedBet', {
            filter: {},
            bettor: this.web3.eth.defaultAccount,
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logDeposit(fromBlock, toBlock) {
        return await this.getPastEvents('LogDeposit', {
            filter: {},
            _address: this.web3.eth.defaultAccount,
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logWithdraw(fromBlock, toBlock) {
        return await this.getPastEvents('LogWithdraw', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logUpdatedTime(fromBlock, toBlock) {
        return await this.getPastEvents('LogUpdatedTime', {
            filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}