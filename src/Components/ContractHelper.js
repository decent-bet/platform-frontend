import { default as Contract } from 'truffle-contract';

import DecentBetToken from '../../build/contracts/TestDecentBetToken.json'
import House from '../../build/contracts/House.json'
import BettingProvider from '../../build/contracts/BettingProvider.json'
import SlotsChannelFinalizer from '../../build/contracts/SlotsChannelFinalizer.json'
import SlotsChannelManager from '../../build/contracts/SlotsChannelManager.json'
import SportsOracle from '../../build/contracts/SportsOracle.json'

import Helper from './Helper'
import KeyHandler from './Base/KeyHandler'
import NonceHandler from './Base/NonceHandler'

const constants = require('./Constants')

const async = require('async')
const ethUtil  = require('ethereumjs-util')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')
const Promise = require('bluebird')

const helper = new Helper()
const keyHandler = new KeyHandler()
const nonceHandler = new NonceHandler()

const ethAccounts = new EthAccounts(helper.getGethProvider())

let web3
let provider

let bettingProvider, decentBetToken, house, houseOffering, slotsChannelManager, slotsChannelFinalizer, sportsOracle

let bettingProviderInstance, decentBetTokenInstance, houseInstance, slotsChannelManagerInstance,
    slotsChannelFinalizerInstance, sportsOracleInstance

const TYPE_DBET_TOKEN = 0,
    TYPE_HOUSE = 1,
    TYPE_BETTING_PROVIDER = 2,
    TYPE_SLOTS_CHANNEL_FINALIZER = 3,
    TYPE_SLOTS_CHANNEL_MANAGER = 4,
    TYPE_SPORTS_ORACLE = 5

class ContractHelper {

    constructor() {
        web3 = window.web3Object
        provider = window.web3Object.currentProvider

        house = Contract(House)
        sportsOracle = Contract(SportsOracle)
        decentBetToken = Contract(DecentBetToken)
        bettingProvider = Contract(BettingProvider)
        slotsChannelManager = Contract(SlotsChannelManager)
        slotsChannelFinalizer = Contract(SlotsChannelFinalizer)

        for (let c of [bettingProvider, decentBetToken, house, slotsChannelFinalizer, slotsChannelManager, sportsOracle]) {
            c.setProvider(provider)
            
            // Dirty hack for web3@1.0.0 support for localhost testrpc, 
            // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
            if (typeof c.currentProvider.sendAsync !== "function") {
                c.currentProvider.sendAsync = function() {
                    return c.currentProvider.send.apply(
                        c.currentProvider, arguments
                    )
                }
            }
        }
    }

    getTokenInstance = () => {
        return decentBetTokenInstance
    }

    getSlotsChannelManagerInstance = () => {
        return slotsChannelManagerInstance
    }

    getBettingProviderInstance = () => {
        return bettingProviderInstance
    }

    getSportsOracleInstance = () => {
        return sportsOracleInstance
    }

    getHouseInstance = () => {
        return houseInstance
    }

    getTokenContract = (callback) => {
        this.getContract(TYPE_DBET_TOKEN, callback)
    }

    getHouseContract = (callback) => {
        this.getContract(TYPE_HOUSE, callback)
    }

    getBettingProviderContract = (callback) => {
        this.getContract(TYPE_BETTING_PROVIDER, callback)
    }

    getSlotsChannelManagerContract = (callback) => {
        this.getContract(TYPE_SLOTS_CHANNEL_MANAGER, callback)
    }

    getSlotsChannelFinalizerContract = (callback) => {
        this.getContract(TYPE_SLOTS_CHANNEL_FINALIZER, callback)
    }

    getSportsOracleContract = (callback) => {
        this.getContract(TYPE_SPORTS_ORACLE, callback)
    }

    getAllContracts = (callback) => {
        const self = this
        async.parallel({
            token: (callback) => {
                this.getTokenContract((instance) => {
                    self.setInstance(TYPE_DBET_TOKEN, instance)
                    callback(null, instance)
                })
            },
            house: (callback) => {
                this.getHouseContract((instance) => {
                    self.setInstance(TYPE_HOUSE, instance)
                    callback(null, instance)
                })
            },
            bettingProvider: (callback) => {
                this.getBettingProviderContract((instance) => {
                    self.setInstance(TYPE_BETTING_PROVIDER, instance)
                    callback(null, instance)
                })
            },
            slotsChannelManager: (callback) => {
                this.getSlotsChannelManagerContract((instance) => {
                    self.setInstance(TYPE_SLOTS_CHANNEL_MANAGER, instance)
                    callback(null, instance)
                })
            },
            slotsChannelFinalizer: (callback) => {
                this.getSlotsChannelFinalizerContract((instance) => {
                    self.setInstance(TYPE_SLOTS_CHANNEL_FINALIZER, instance)
                    callback(null, instance)
                })
            },
            sportsOracle: (callback) => {
                this.getSportsOracleContract((instance) => {
                    self.setInstance(TYPE_SPORTS_ORACLE, instance)
                    callback(null, instance)
                })
            },
        }, (err, results) => {
            callback(false, results)
        })
    }

    getContract = (type, callback) => {
        const self = this
        let instance = this.getInstance(type)
        if (!instance) {
            console.log('getContract: ' + type)
            this.getContractObject(type).deployed().then(function (_instance) {
                console.log('Deployed', type, _instance.address)
                self.setInstance(type, _instance)
                callback(_instance)
            }).catch(function (err) {
                console.log('Deploy error', type, err.message)
            })
        } else
            callback(instance)
    }

    getContractObject = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetToken
            case TYPE_HOUSE:
                return house
            case TYPE_BETTING_PROVIDER:
                return bettingProvider
            case TYPE_SLOTS_CHANNEL_FINALIZER:
                return slotsChannelFinalizer
            case TYPE_SLOTS_CHANNEL_MANAGER:
                return slotsChannelManager
            case TYPE_SPORTS_ORACLE:
                return sportsOracle
        }
        return null
    }

    getInstance = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetTokenInstance
            case TYPE_HOUSE:
                return houseInstance
            case TYPE_BETTING_PROVIDER:
                return bettingProviderInstance
            case TYPE_SLOTS_CHANNEL_FINALIZER:
                return slotsChannelFinalizerInstance
            case TYPE_SLOTS_CHANNEL_MANAGER:
                return slotsChannelManagerInstance
            case TYPE_SPORTS_ORACLE:
                return sportsOracleInstance
        }
        return null
    }

    setInstance = (type, instance) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                decentBetTokenInstance = instance
                break
            case TYPE_HOUSE:
                houseInstance = instance
                break
            case TYPE_BETTING_PROVIDER:
                bettingProviderInstance = instance
                break
            case TYPE_SLOTS_CHANNEL_FINALIZER:
                slotsChannelFinalizerInstance = instance
                break
            case TYPE_SLOTS_CHANNEL_MANAGER:
                slotsChannelManagerInstance = instance
                break
            case TYPE_SPORTS_ORACLE:
                sportsOracleInstance = instance
                break
        }
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        return {
            token: () => {
                return {
                    /** Getters */
                    allowance: (owner, spender) => {
                        return decentBetTokenInstance.allowance.call(owner, spender, {
                            from: window.web3Object.eth.defaultAccount,
                        })
                    },
                    balanceOf: (address) => {
                        return decentBetTokenInstance.balanceOf.call(address, {
                            from: window.web3Object.eth.defaultAccount,
                        })
                    },
                    /** Setters */
                    approve: (address, value) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'approve',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'spender',
                                    type: 'address'
                                },
                                {
                                    name: 'value',
                                    type: 'uint256'
                                }
                            ]
                        }, [address, value])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            decentBetTokenInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    faucet: () => {
                        console.log('Sending faucet tx')

                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'faucet',
                            type: 'function',
                            inputs: []
                        }, [])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            decentBetTokenInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    /**
                     * Events
                     * */
                    logTransfer: (address, isFrom, fromBlock, toBlock) => {
                        let options = {}
                        options[isFrom ? 'from' : 'to'] = address
                        return decentBetTokenInstance.Transfer(options, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            },
            house: () => {
                return {
                    /**
                     * Getters
                     */
                    getCurrentSession: () => {
                        return houseInstance.currentSession()
                    },
                    getProfitSharePercent: () => {
                        return houseInstance.profitSharePercent()
                    },
                    // Mapping (uint => Session)
                    getSession: (sessionNumber) => {
                        return houseInstance.sessions(sessionNumber)
                    },
                    getHouseFunds: (sessionNumber) => {
                        return houseInstance.houseFunds(sessionNumber)
                    },
                    getUserCreditsForSession: (sessionNumber, address) => {
                        return houseInstance.getUserCreditsForSession.call(sessionNumber, address, {
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    getAuthorizedAddresses: (index) => {
                        return houseInstance.authorizedAddresses(index)
                    },
                    addToAuthorizedAddresses: (address) => {
                        return houseInstance.addToAuthorizedAddresses(address)
                    },
                    removeFromAuthorizedAddresses: (address) => {
                        return houseInstance.removeFromAuthorizedAddresses(address)
                    },
                    lotteries: (session) => {
                        return houseInstance.lotteries(session)
                    },
                    lotteryTicketHolders: (session, ticketNumber) => {
                        return houseInstance.lotteryTicketHolders(session, ticketNumber)
                    },
                    lotteryUserTickets: (session, address, index) => {
                        return houseInstance.lotteryUserTickets(session, address, index)
                    },
                    /**
                     * Setters
                     */
                    purchaseCredits: (amount) => {
                        return houseInstance.purchaseCredits.sendTransaction(amount, {
                            from: window.web3Object.eth.defaultAccount,
                            gas: 5000000
                        })
                    },
                    /**
                     * Events
                     */
                    logPurchasedCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogPurchasedCredits({
                            creditHolder: window.web3Object.eth.defaultAccount,
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logLiquidateCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogLiquidateCredits({
                            creditHolder: window.web3Object.eth.defaultAccount,
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            },
            bettingProvider: () => {
                return {
                    /**
                     * Getters
                     */
                    getGamesCount: () => {
                        return bettingProviderInstance.gamesCount()
                    },
                    getGame: (id) => {
                        return bettingProviderInstance.getGame.call(id)
                    },
                    getGamePeriodBetLimits: (id, period) => {
                        return bettingProviderInstance.getGamePeriodBetLimits(id, period)
                    },
                    getGameMaxBetLimit: (id) => {
                        return bettingProviderInstance.getGameMaxBetLimit(id)
                    },
                    getGameBettor: (id, index) => {
                        return bettingProviderInstance.getGameBettor(id, index)
                    },
                    getGameBettorBet: (id, address, betId) => {
                        return bettingProviderInstance.getGameBettorBet(id, address, betId)
                    },
                    getGameBettorBetOdds: (id, address, betId) => {
                        return bettingProviderInstance.getGameBettorBetOdds(id, address, betId)
                    },
                    getGameBettorBetOddsDetails: (id, address, betId) => {
                        return bettingProviderInstance.getGameBettorBetOddsDetails(id, address, betId)
                    },
                    getGameOddsCount: (id) => {
                        return bettingProviderInstance.getGameOddsCount(id)
                    },
                    getGameOdds: (id, oddsId) => {
                        return bettingProviderInstance.getGameOdds(id, oddsId)
                    },
                    getGameOddsDetails: (id, oddsId) => {
                        return bettingProviderInstance.getGameOddsDetails(id, oddsId)
                    },
                    getGameOutcome: (id, period) => {
                        return bettingProviderInstance.getGameOutcome(id, period)
                    },
                    getDepositedTokens: (address, sessionNumber) => {
                        return bettingProviderInstance.depositedTokens(address, sessionNumber)
                    },
                    getSessionStats: (sessionNumber) => {
                        return bettingProviderInstance.sessionStats(sessionNumber)
                    },
                    getSportsOracleAddress: () => {
                        return bettingProviderInstance.sportsOracleAddress()
                    },
                    getHouseAddress: () => {
                        return bettingProviderInstance.houseAddress()
                    },
                    getCurrentSession: () => {
                        return bettingProviderInstance.currentSession()
                    },
                    getTime: () => {
                        return bettingProviderInstance.getTime()
                    },
                    getUserBets: (address, index) => {
                        return bettingProviderInstance.getUserBets(address, index)
                    },
                    getBetReturns: (gameId, betId, bettor) => {
                        return bettingProviderInstance.getBetReturns(gameId, betId, bettor)
                    },
                    balanceOf: (address, session) => {
                        console.log('Retrieving sportsbook balance for', address, session)
                        return bettingProviderInstance.balanceOf(address, session)
                    },
                    /**
                     * Setters
                     */
                    deposit: (amount) => {
                        console.log('Depositing', amount, 'to sportsbook as', window.web3Object.eth.defaultAccount)
                        
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'deposit',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'amount',
                                    type: 'uint256'
                                }
                            ]
                        }, [amount])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    withdraw: (amount, session) => {
                        console.log('Withdraw', amount, 'from sportsbook as', window.web3Object.eth.defaultAccount)
                        
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'withdraw',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'amount',
                                    type: 'uint256'
                                },
                                {
                                    name: 'session',
                                    type: 'uint256'
                                }
                            ]
                        }, [amount, session])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    setSportsOracle: (address) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'setSportsOracle',
                            type: 'function',
                            inputs: [
                                {
                                    name: '_address',
                                    type: 'address'
                                }
                            ]
                        }, [address])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    changeAssistedClaimTimeOffset: (offset) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'changeAssistedClaimTimeOffset',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'offset',
                                    type: 'uint256'
                                }
                            ]
                        }, [offset])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    addGame: (oracleGameId, cutOffTime, endTime) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'addGame',
                            type: 'function',
                            inputs: [
                                {
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

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    updateGamePeriodBetLimits: (id, period, limits) => {
                        console.log('updateGamePeriodBetLimits', id, period, limits)
                        
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'updateGamePeriodBetLimits',
                            type: 'function',
                            inputs: [
                                {
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

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    pushGameOdds: (id, refId, period, handicap, team1, team2, draw, betType, points, over, under, isTeam1) => {
                        console.log('pushGameOdds params', id, refId, period, handicap, team1, team2, draw, betType, points, over, under, isTeam1)
                        
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'pushGameOdds',
                            type: 'function',
                            inputs: [
                                {
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
                        }, [id, refId, period, handicap, team1, team2, draw, betType, points, over, under, isTeam1])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    updateGameOdds: (id, oddsId, betType, handicap, team1, team2, draw, points, over, under) => {
                        
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'updateGameOdds',
                            type: 'function',
                            inputs: [
                                {
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
                        }, [id, oddsId, betType, handicap, team1, team2, draw, points, over, under])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    updateGameOutcome: (id, period, result, team1Points, team2Points) => {

                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'updateGameOutcome',
                            type: 'function',
                            inputs: [
                                {
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

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    placeBet: (gameId, oddsId, betType, choice, amount) => {
                        console.log('Placing bet', gameId, oddsId, betType, choice, amount)

                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'placeBet',
                            type: 'function',
                            inputs: [
                                {
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

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    claimBet: (gameId, betId, bettor) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'claimBet',
                            type: 'function',
                            inputs: [
                                {
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

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    /**
                     * Events
                     */
                    logNewGame: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogNewGame({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logNewGameOdds: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogNewGameOdds({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logUpdatedGameOdds: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedGameOdds({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logUpdatedMaxBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedMaxBet({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logUpdatedBetLimits: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedBetLimits({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logNewBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogNewBet({}, {
                            bettor: window.web3Object.eth.defaultAccount,
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logClaimedBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogClaimedBet({}, {
                            bettor: window.web3Object.eth.defaultAccount,
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logDeposit: (fromBlock, toBlock) => {
                        return bettingProviderInstance.Deposit({}, {
                            _address: window.web3Object.eth.defaultAccount,
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logWithdraw: (fromBlock, toBlock) => {
                        return bettingProviderInstance.Withdraw({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logUpdatedTime: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedTime({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            },
            sportsOracle: () => {
                return {
                    /**
                     * Getters
                     */
                    getOwner: () => {
                        return sportsOracleInstance.owner()
                    },
                    getBalance: () => {
                        return this.getWrappers().token().balanceOf(sportsOracleInstance.address)
                    },
                    getGameUpdateCost: () => {
                        return sportsOracleInstance.gameUpdateCost()
                    },
                    getProviderAcceptanceCost: () => {
                        return sportsOracleInstance.providerAcceptanceCost()
                    },
                    getPayForProviderAcceptance: () => {
                        return sportsOracleInstance.payForProviderAcceptance()
                    },
                    getAuthorizedAddresses: (index) => {
                        return sportsOracleInstance.authorizedAddresses(index)
                    },
                    getRequestedProviderAddresses: (index) => {
                        return sportsOracleInstance.requestedProviderAddresses(index)
                    },
                    getAcceptedProviderAddresses: (index) => {
                        return sportsOracleInstance.acceptedProviderAddresses(index)
                    },
                    getGamesCount: () => {
                        return sportsOracleInstance.gamesCount()
                    },
                    getGame: (gameId) => {
                        return sportsOracleInstance.games(gameId)
                    },
                    getAvailableGamePeriods: (gameId, index) => {
                        return sportsOracleInstance.availableGamePeriods(gameId, index)
                    },
                    getGameProvidersUpdateList: (gameId, index) => {
                        return sportsOracleInstance.gameProvidersUpdateList(gameId, index)
                    },
                    getProviderGameToUpdate: (gameId, providerAddress) => {
                        return sportsOracleInstance.providerGamesToUpdate(gameId, providerAddress)
                    },
                    getGamePeriods: (gameId, periodNumber) => {
                        return sportsOracleInstance.gamePeriods(gameId, periodNumber)
                    },
                    getTime: () => {
                        return sportsOracleInstance.getTime()
                    },
                    /**
                     * Events
                     */
                    logNewAuthorizedAddress: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewAuthorizedAddress({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logNewAcceptedProvider: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewAcceptedProvider({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logGameAdded: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogGameAdded({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logGameDetailsUpdate: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogGameDetailsUpdate({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logGameResult: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogGameResult({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logUpdatedProviderOutcome: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogUpdatedProviderOutcome({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logWithdrawal: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogWithdrawal({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logNewGameUpdateCost: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewGameUpdateCost({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logNewProviderAcceptanceCost: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewProviderAcceptanceCost({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logUpdatedTime: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogUpdatedTime({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            },
            slotsChannelFinalizer: () => {
                return {
                    finalize: (id, userSpin, houseSpin) => {
                        id = parseInt(id)
                        userSpin = self.getSpinParts(userSpin)
                        houseSpin = self.getSpinParts(houseSpin)

                        console.log('Finalize', id, typeof id, window.web3Object.eth.defaultAccount)

                        let logKeys = (spin) => {
                            Object.keys(spin).forEach((key) => {
                                console.log('Finalize', key, spin[key], typeof spin[key])
                            })
                        }

                        logKeys(userSpin)
                        logKeys(houseSpin)

                        console.log('Finalize string: \"' + id + '\", \"' + userSpin.parts + '\", \"' +
                            houseSpin.parts + '\", \"' + userSpin.r + '\", \"' + userSpin.s + '\", \"' +
                            houseSpin.r + '\", \"' + houseSpin.s + '\"')

                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'finalize',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'id',
                                    type: 'uint256'
                                },
                                {
                                    name: '_curr',
                                    type: 'string'
                                },
                                {
                                    name: '_prior',
                                    type: 'string'
                                },
                                {
                                    name: 'currR',
                                    type: 'bytes32'
                                },
                                {
                                    name: 'currS',
                                    type: 'bytes32'
                                },
                                {
                                    name: 'priorR',
                                    type: 'bytes32'
                                },
                                {
                                    name: 'priorS',
                                    type: 'bytes32'
                                }
                            ]
                        }, [id, userSpin.parts, houseSpin.parts, userSpin.r, userSpin.s, houseSpin.r, houseSpin.s])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            slotsChannelFinalizerInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    }
                }
            },
            slotsChannelManager: () => {
                return {
                    /**
                     * Getters
                     */
                    getChannelInfo: (id) => {
                        return slotsChannelManagerInstance.getChannelInfo.call(id, {
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    getChannelHashes: (id) => {
                        return slotsChannelManagerInstance.getChannelHashes.call(id, {
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    checkSig: (id, msgHash, sign, turn) => {
                        console.log('Checksig', id, msgHash, sign, turn)
                        return slotsChannelManagerInstance.checkSig.call(id, msgHash, sign, turn, {
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    balanceOf: (address, session) => {
                        return slotsChannelManagerInstance.balanceOf.call(address, session, {
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    currentSession: () => {
                        return slotsChannelManagerInstance.currentSession.call({
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    isChannelClosed: (id) => {
                        return slotsChannelManagerInstance.isChannelClosed.call(id, {
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    finalBalances: (id, isHouse) => {
                        return slotsChannelManagerInstance.finalBalances.call(id, isHouse, {
                            from: window.web3Object.eth.defaultAccount
                        })
                    },
                    /**
                     * Setters
                     */
                    createChannel: (deposit) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'createChannel',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'initialDeposit',
                                    type: 'uint256'
                                }
                            ]
                        }, [deposit])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            slotsChannelManagerInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    deposit: (amount) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'deposit',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'amount',
                                    type: 'uint256'
                                }
                            ]
                        }, [amount])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            slotsChannelManagerInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    withdraw: (amount, session) => {
                        console.log('Withdraw', amount, 'from slots channel manager as',
                                    window.web3Object.eth.defaultAccount)

                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'withdraw',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'amount',
                                    type: 'uint256'
                                },
                                {
                                    name: 'session',
                                    type: 'uint256'
                                }
                            ]
                        }, [amount, session])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            slotsChannelManagerInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    depositToChannel: (id, initialUserNumber, finalUserHash) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'depositChannel',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'id',
                                    type: 'uint256'
                                },
                                {
                                    name: '_initialUserNumber',
                                    type: 'string'
                                },
                                {
                                    name: '_finalUserHash',
                                    type: 'string'
                                }
                            ]
                        }, [id, initialUserNumber, finalUserHash])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            slotsChannelManagerInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    claim: (id) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'claim',
                            type: 'function',
                            inputs: [
                                {
                                    name: 'id',
                                    type: 'uint256'
                                }
                            ]
                        }, [id])

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            slotsChannelManagerInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    /**
                     * Events
                     */
                    logNewChannel: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogNewChannel({
                            user: window.web3Object.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelDeposit: (id, fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelDeposit({
                            user: window.web3Object.eth.defaultAccount,
                            id: id
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelActivate: (id, fromBlock, toBlock) => {
                        console.log('logChannelActivate', window.web3Object.eth.defaultAccount)
                        return slotsChannelManagerInstance.LogChannelActivate({
                            user: window.web3Object.eth.defaultAccount,
                            id: id
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelFinalized: (id, fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelFinalized({
                            id: id
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logClaimChannelTokens: (id, fromBlock, toBlock) => {
                        const filter = (id ? {id: id} : {})
                        return slotsChannelManagerInstance.LogClaimChannelTokens(filter, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logDeposit: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogDeposit({
                            _address: window.web3Object.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logWithdraw: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogWithdraw({
                            _address: window.web3Object.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            }
        }
    }

    getSpinParts = (spin) => {
        let sign = spin.sign

        let sigParams = ethUtil.fromRpcSig(sign)

        let r = ethUtil.bufferToHex(sigParams.r)
        let s = ethUtil.bufferToHex(sigParams.s)
        let v = ethUtil.bufferToInt(sigParams.v)

        console.log('getSpinParts sig: ', v, r, s)

        console.log('getSpinParts reverse sig: ', ethUtil.toRpcSig(v, r, s))

        return {
            parts: spin.reelHash + '/' + (spin.reel != '' ? spin.reel.toString() : '') + '/' + spin.reelSeedHash +
            '/' + spin.prevReelSeedHash + '/' + spin.userHash + '/' + spin.prevUserHash + '/' + spin.nonce +
            '/' + spin.turn + '/' + spin.userBalance + '/' + spin.houseBalance + '/' + spin.betSize + '/' + v,
            r: r,
            s: s
        }
    }

    signAndSendRawTransaction = Promise.promisify((privateKey, to, gasPrice, gas, data, callback) => {
        window.web3Object.eth.getTransactionCount(window.web3Object.eth.defaultAccount, 'latest', (err, count) => {
            console.log('Tx count', err, count)
            if (!err) {
                let nonce = nonceHandler.get(count)

                let tx = {
                    from: window.web3Object.eth.defaultAccount,
                    to: to,
                    gas: gas,
                    data: data,
                    nonce: nonce
                }
                console.log('Tx', tx)

                /** If not set, it'll be automatically pulled from the Ethereum network */
                if (gasPrice)
                    tx.gasPrice = gasPrice

                ethAccounts.signTransaction(tx, privateKey, (err, res) => {
                    console.log('Signed raw tx', err, res ? res.rawTransaction : '')
                    if (!err) {
                        console.log(web3.eth)
                        web3.eth.sendSignedTransaction(res.rawTransaction, (err, res) => {
                            nonceHandler.set(nonce)
                            callback(err, res)
                        })
                    } else
                        callback(true, 'Error signing transaction')
                })
            } else
                callback(true, 'Error retrieving nonce')
        })
    })

}

export default ContractHelper