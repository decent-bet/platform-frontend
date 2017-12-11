/**
 * Created by user on 4/12/2017.
 */

const ethUtil = require('ethereumjs-util')

import DecentBetToken from '../../../build/contracts/TestDecentBetToken.json'
import House from '../../../build/contracts/House.json'
import BettingProvider from '../../../build/contracts/BettingProvider.json'
import SlotsChannelFinalizer from '../../../build/contracts/SlotsChannelFinalizer.json'
import SlotsChannelManager from '../../../build/contracts/SlotsChannelManager.json'
import SportsOracle from '../../../build/contracts/SportsOracle.json'

import Web3 from 'web3'

const async = require('async')
const ethUnits = require('ethereum-units')

const provider = window.web3.currentProvider
const contract = require('truffle-contract')
const decentBetToken = contract(DecentBetToken)
const house = contract(House)
const bettingProvider = contract(BettingProvider)
const slotsChannelFinalizer = contract(SlotsChannelFinalizer)
const slotsChannelManager = contract(SlotsChannelManager)
const sportsOracle = contract(SportsOracle)

decentBetToken.setProvider(provider)
house.setProvider(provider)
bettingProvider.setProvider(provider)
slotsChannelFinalizer.setProvider(provider)
slotsChannelManager.setProvider(provider)
sportsOracle.setProvider(provider)

// Get Web3 so we can get our accounts.
const web3 = window.web3

// Declaring these for later so we can chain functions on Contract objects.
let decentBetTokenInstance, houseInstance, bettingProviderInstance, slotsChannelFinalizerInstance,
    slotsChannelManagerInstance, sportsOracleInstance

const TYPE_DBET_TOKEN = 0,
    TYPE_HOUSE = 1,
    TYPE_BETTING_PROVIDER = 2,
    TYPE_SLOTS_CHANNEL_FINALIZER = 3,
    TYPE_SLOTS_CHANNEL_MANAGER = 4,
    TYPE_SPORTS_ORACLE = 5

class ContractHelper {

    getWeb3 = () => {
        return web3
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
            callback(false, results.token, results.house, results.bettingProvider)
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
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    balanceOf: (address) => {
                        return decentBetTokenInstance.balanceOf.call(address, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    /** Setters */
                    approve: (address, value) => {
                        return decentBetTokenInstance.approve.sendTransaction(address, value, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    faucet: () => {
                        return decentBetTokenInstance.faucet.sendTransaction({
                            from: window.web3.eth.defaultAccount
                        })
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
                            from: window.web3.eth.defaultAccount
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
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    /**
                     * Events
                     */
                    logPurchasedCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogPurchasedCredits({
                            creditHolder: window.web3.eth.defaultAccount,
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logLiquidateCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogLiquidateCredits({
                            creditHolder: window.web3.eth.defaultAccount,
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
                    getUserBets: (address, index) => {
                        return bettingProviderInstance.getUserBets(address, index)
                    },
                    balanceOf: (address, session) => {
                        console.log('Retrieving sportsbook balance for', address, session)
                        return bettingProviderInstance.balanceOf(address, session)
                    },
                    /**
                     * Setters
                     */
                    deposit: (amount) => {
                        console.log('Depositing', amount, 'to sportsbook as', window.web3.eth.defaultAccount)
                        return bettingProviderInstance.deposit.sendTransaction(amount, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    setSportsOracle: (address) => {
                        return bettingProviderInstance.setSportsOracle.sendTransaction(address, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    changeAssistedClaimTimeOffset: (offset) => {
                        return bettingProviderInstance.changeAssistedClaimTimeOffset.sendTransaction(offset, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    addGame: (oracleGameId, cutOffTime, endTime) => {
                        return bettingProviderInstance.addGame.sendTransaction(oracleGameId, cutOffTime, endTime, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    updateGamePeriodBetLimits: (id, period, limits) => {
                        console.log('updateGamePeriodBetLimits', id, period, limits)
                        return bettingProviderInstance.updateGamePeriodBetLimits.sendTransaction(id, period, limits, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    updateGameMaxBetLimits: (id, maxBetLimit) => {
                        console.log('updateGamePeriodBetLimits', id, maxBetLimit)
                        return bettingProviderInstance.updateGameMaxBetLimits.sendTransaction(id, maxBetLimit, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    pushGameOdds: (id, refId, period, handicap, team1, team2, draw, betType, points,
                                   over, under, isTeam1) => {
                        console.log('pushGameOdds params', id, refId, period, handicap, team1, team2, draw,
                            betType, points, over, under, isTeam1)
                        return bettingProviderInstance.pushGameOdds.sendTransaction(id, refId, period, handicap,
                            team1, team2, draw, betType, points, over, under, isTeam1, {
                                from: window.web3.eth.defaultAccount
                            })
                    },
                    updateGameOdds: (id, oddsId, handicap, team1, team2, draw, points, over, under) => {
                        return bettingProviderInstance.updateGameOdds.sendTransaction(id, oddsId, handicap, team1,
                            team2, draw, points, over, under, {
                                from: window.web3.eth.defaultAccount
                            })
                    },
                    updateGameOutcome: (id, period, result, team1Points, team2Points) => {
                        return bettingProviderInstance.updateGameOutcome.sendTransaction(id, period, result,
                            team1Points, team2Points, {
                                from: window.web3.eth.defaultAccount
                            })
                    },
                    placeBet: (gameId, oddsId, betType, choice, amount) => {
                        console.log('Placing bet', gameId, oddsId, betType, choice, amount)
                        return bettingProviderInstance.placeBet.sendTransaction(gameId, oddsId, betType,
                            choice, amount, {
                                from: window.web3.eth.defaultAccount
                            })
                    },
                    claimBet: (gameId, betId, bettor) => {
                        return bettingProviderInstance.claimBet.sendTransaction(gameId, betId, bettor, {
                            from: window.web3.eth.defaultAccount
                        })
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
                    logNewBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogNewBet({}, {
                            _address: window.web3.eth.defaultAccount,
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logClaimedBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogClaimedBet({}, {
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logDeposit: (fromBlock, toBlock) => {
                        return bettingProviderInstance.Deposit({}, {
                            _address: window.web3.eth.defaultAccount,
                            fromBlock: fromBlock ? fromBlock : 'latest',
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logWithdraw: (fromBlock, toBlock) => {
                        return bettingProviderInstance.Withdraw({}, {
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
                    /**
                     * Setters
                     */
                    togglePayForProviderAcceptance: (enabled) => {
                        return sportsOracleInstance.togglePayForProviderAcceptance.sendTransaction(enabled, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    addAuthorizedAddress: (address) => {
                        return sportsOracleInstance.addAuthorizedAddress.sendTransaction(address, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    changeGameUpdateCost: (cost) => {
                        cost *= ethUnits.units.ether
                        return sportsOracleInstance.changeGameUpdateCost.sendTransaction(cost, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    changeProviderAcceptanceCost: (cost) => {
                        cost *= ethUnits.units.ether
                        return sportsOracleInstance.changeProviderAcceptanceCost.sendTransaction(cost, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    acceptProvider: (address) => {
                        return sportsOracleInstance.acceptProvider.sendTransaction(address, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    addGame: (refId, sportId, leagueId, startTime, endTime, availablePeriods, ipfsHash) => {
                        return sportsOracleInstance.addGame.sendTransaction(refId, sportId, leagueId, startTime, endTime,
                            availablePeriods, ipfsHash, {
                                from: window.web3.eth.defaultAccount
                            })
                    },
                    updateGameDetails: (id, ipfsHash) => {
                        return sportsOracleInstance.updateGameDetails.sendTransaction(id, ipfsHash, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    pushOutcome: (id, period, result, totalPoints, team1Points, team2Points) => {
                        return sportsOracleInstance.pushOutcome.sendTransaction(id, period, result, totalPoints,
                            team1Points, team2Points, {
                                from: window.web3.eth.defaultAccount
                            })
                    },
                    updateProviderOutcome: (id, providerAddress, period, result, team1Points, team2Points) => {
                        return sportsOracleInstance.updateProviderOutcome.sendTransaction(id, providerAddress, period,
                            result, team1Points, team2Points, {
                                from: window.web3.eth.defaultAccount
                            })
                    },
                    withdrawTokens: () => {
                        return sportsOracleInstance.withdrawTokens().sendTransaction({
                            from: window.web3.eth.defaultAccount
                        })
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
                    }
                }
            },
            slotsChannelFinalizer: () => {
                return {
                    finalize: (id, userSpin, houseSpin) => {
                        id = parseInt(id)
                        userSpin = self.getSpinParts(userSpin)
                        houseSpin = self.getSpinParts(houseSpin)

                        console.log('Finalize', id, typeof id)

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

                        return slotsChannelFinalizerInstance.finalize.call(id, userSpin.parts,
                            houseSpin.parts, userSpin.r, userSpin.s, houseSpin.r, houseSpin.s, {
                                from: window.web3.eth.defaultAccount
                            })
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
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    getChannelHashes: (id) => {
                        return slotsChannelManagerInstance.getChannelHashes.call(id, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    checkSig: (id, msgHash, sign, turn) => {
                        console.log('Checksig', id, msgHash, sign, turn)
                        return slotsChannelManagerInstance.checkSig.call(id, msgHash, sign, turn, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    balanceOf: (address, session) => {
                        return slotsChannelManagerInstance.balanceOf.call(address, session, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    currentSession: () => {
                        return slotsChannelManagerInstance.currentSession.call({
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    /**
                     * Setters
                     */
                    createChannel: (deposit) => {
                        return slotsChannelManagerInstance.createChannel.sendTransaction(deposit,
                            {from: window.web3.eth.defaultAccount})
                    },
                    deposit: (amount) => {
                        return slotsChannelManagerInstance.deposit.sendTransaction(amount,
                            {from: window.web3.eth.defaultAccount})
                    },
                    depositToChannel: (id, initialUserNumber, finalUserHash) => {
                        return slotsChannelManagerInstance.depositChannel.sendTransaction(id,
                            initialUserNumber, finalUserHash,
                            {from: window.web3.eth.defaultAccount})
                    },
                    /**
                     * Events
                     */
                    logNewChannel: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogNewChannel({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelDeposit: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelDeposit({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelActivate: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelActivate({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelFinalized: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelFinalized({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logDeposit: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogDeposit({
                            _address: window.web3.eth.defaultAccount
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

}

export default ContractHelper