import BettingProviderJson from '../../../build/contracts/BettingProvider.json'
import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import AbstractContract from './AbstractContract'

// Used for VSCode Type Checking
import Web3 from 'web3' // eslint-disable-line no-unused-vars

const keyHandler = new KeyHandler()

export default class BettingProviderContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, BettingProviderJson)
    }

    /**
     * Getters
     */

    /**
     * 
     */
    getGamesCount() {
        return this.contract.methods.gamesCount().call()
    }

    /**
     * 
     * @param {string} id 
     */
    getGame(id) {
        return this.contract.methods.getGame(id).call()
    }

    getGamePeriodBetLimits(id, period) {
        return this.contract.methods.getGamePeriodBetLimits(id, period).call()
    }

    getGameMaxBetLimit(id) {
        return this.contract.methods.getGameMaxBetLimit(id).call()
    }

    getGameBettor(id, index) {
        return this.contract.methods.getGameBettor(id, index).call()
    }

    getGameBettorBet(id, address, betId) {
        return this.contract.methods.getGameBettorBet(id, address, betId).call()
    }

    getGameBettorBetOdds(id, address, betId) {
        return this.contract.methods.getGameBettorBetOdds(id, address, betId).call()
    }

    getGameBettorBetOddsDetails(id, address, betId) {
        return this.contract.methods.getGameBettorBetOddsDetails(id, address, betId).call()
    }

    getGameOddsCount(id) {
        return this.contract.methods.getGameOddsCount(id).call()
    }

    getGameOdds(id, oddsId) {
        return this.contract.methods.getGameOdds(id, oddsId).call()
    }

    getGameOddsDetails(id, oddsId) {
        return this.contract.methods.getGameOddsDetails(id, oddsId).call()
    }

    getGameOutcome(id, period) {
        return this.contract.methods.getGameOutcome(id, period).call()
    }

    getDepositedTokens(address, sessionNumber) {
        return this.contract.methods.depositedTokens(address, sessionNumber).call()
    }

    getSessionStats(sessionNumber) {
        return this.contract.methods.sessionStats(sessionNumber).call()
    }

    getSportsOracleAddress() {
        return this.contract.methods.sportsOracleAddress().call()
    }

    getHouseAddress() {
        return this.contract.methods.houseAddress().call()
    }

    getCurrentSession() {
        return this.contract.methods.currentSession().call()
    }

    getTime() {
        return this.contract.methods.getTime().call()
    }

    getUserBets(address, index) {
        return this.contract.methods.getUserBets(address, index).call()
    }

    getBetReturns(gameId, betId, bettor) {
        return this.contract.methods.getBetReturns(gameId, betId, bettor).call()
    }
    
    balanceOf(address, session) {
        console.log(
            'Retrieving sportsbook balance for',
            address,
            session
        )
        return this.contract.methods.balanceOf(address, session).call()
    }

    /**
     * Setters
     */
    deposit(amount) {
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    withdraw(amount, session) {
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    setSportsOracle(address) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'setSportsOracle',
            type: 'function',
            inputs: [{
                name: '_address',
                type: 'address'
            }]
        }, [address])

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    changeAssistedClaimTimeOffset(offset) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'changeAssistedClaimTimeOffset',
            type: 'function',
            inputs: [{
                name: 'offset',
                type: 'uint256'
            }]
        }, [offset])

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    addGame(oracleGameId, cutOffTime, endTime) {
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    updateGamePeriodBetLimits(id, period, limits) {
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    pushGameOdds(
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    updateGameOdds(
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    updateGameOutcome(
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    placeBet(gameId, oddsId, betType, choice, amount) {
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    claimBet(gameId, betId, bettor) {
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    /**
     * Events
     */
    logNewGame(fromBlock, toBlock) {
        return this.contract.events.LogNewGame({filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewGameOdds(fromBlock, toBlock) {
        return this.contract.events.LogNewGameOdds({filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedGameOdds(fromBlock, toBlock) {
        return this.contract.events.LogUpdatedGameOdds({filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedMaxBet(fromBlock, toBlock) {
        return this.contract.events.LogUpdatedMaxBet({filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedBetLimits(fromBlock, toBlock) {
        return this.contract.events.LogUpdatedBetLimits({filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logNewBet(fromBlock, toBlock) {
        return this.contract.events.LogNewBet({filter: {},
            bettor: this.web3.eth.defaultAccount,
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logClaimedBet(fromBlock, toBlock) {
        return this.contract.events.LogClaimedBet({filter: {},
            bettor: this.web3.eth.defaultAccount,
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logDeposit(fromBlock, toBlock) {
        return this.contract.events.LogDeposit({filter: {},
            _address: this.web3.eth.defaultAccount,
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logWithdraw(fromBlock, toBlock) {
        return this.contract.events.LogWithdraw({filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logUpdatedTime(fromBlock, toBlock) {
        return this.contract.events.LogUpdatedTime({filter: {},
            fromBlock: fromBlock ? fromBlock : 'latest',
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}