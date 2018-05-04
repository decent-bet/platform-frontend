import { default as Contract } from 'truffle-contract'

import DecentBetToken from '../../build/contracts/TestDecentBetToken.json'
import House from '../../build/contracts/House.json'
import HouseAuthorizedController from '../../build/contracts/HouseAuthorizedController.json'
import HouseFundsController from '../../build/contracts/HouseFundsController.json'
import HouseLotteryController from '../../build/contracts/HouseLotteryController.json'
import HouseSessionsController from '../../build/contracts/HouseSessionsController.json'
import BettingProvider from '../../build/contracts/BettingProvider.json'
import SlotsChannelFinalizer from '../../build/contracts/SlotsChannelFinalizer.json'
import SportsOracle from '../../build/contracts/SportsOracle.json'

import Helper from '../Components/Helper'
import KeyHandler from './KeyHandler'
import NonceHandler from './NonceHandler'
import async from 'async'
import ethUtil from 'ethereumjs-util'
import ethAbi from 'web3-eth-abi'
import EthAccounts from 'web3-eth-accounts'
import Promise from 'bluebird'

// New Contract Objects
import SlotsChannelManagerContract from './contracts/SlotsChannelManagerContract'

// Used for VSCode Type Checking
import Web3 from 'web3' // eslint-disable-line no-unused-vars

const helper = new Helper()
const keyHandler = new KeyHandler()
const nonceHandler = new NonceHandler()

const ethAccounts = new EthAccounts(helper.getGethProvider())

let bettingProvider,
    decentBetToken,
    house,
    houseAuthorizedController,
    houseFundsController,
    houseLotteryController,
    houseSessionsController,
    slotsChannelFinalizer,
    sportsOracle

let bettingProviderInstance,
    decentBetTokenInstance,
    houseInstance,
    houseAuthorizedControllerInstance,
    houseFundsControllerInstance,
    houseLotteryControllerInstance,
    houseSessionsControllerInstance,
    slotsChannelFinalizerInstance,
    sportsOracleInstance

const TYPE_DBET_TOKEN = 0,
    TYPE_HOUSE = 1,
    TYPE_HOUSE_AUTHORIZED_CONTROLLER = 2,
    TYPE_HOUSE_FUNDS_CONTROLLER = 3,
    TYPE_HOUSE_LOTTERY_CONTROLLER = 4,
    TYPE_HOUSE_SESSIONS_CONTROLLER = 5,
    TYPE_BETTING_PROVIDER = 6,
    TYPE_SLOTS_CHANNEL_FINALIZER = 7,
    TYPE_SPORTS_ORACLE = 9

class ContractHelper {
    /**
     *
     * @param {Web3} web3Param
     */
    constructor(web3Param) {
        this.web3 = web3Param
        this.provider = web3Param.currentProvider

        house = Contract(House)
        houseAuthorizedController = Contract(HouseAuthorizedController)
        houseFundsController = Contract(HouseFundsController)
        houseLotteryController = Contract(HouseLotteryController)
        houseSessionsController = Contract(HouseSessionsController)
        sportsOracle = Contract(SportsOracle)
        decentBetToken = Contract(DecentBetToken)
        bettingProvider = Contract(BettingProvider)
        slotsChannelFinalizer = Contract(SlotsChannelFinalizer)

        for (let c of [
            bettingProvider,
            decentBetToken,
            house,
            houseAuthorizedController,
            houseFundsController,
            houseLotteryController,
            houseSessionsController,
            slotsChannelFinalizer,
            sportsOracle
        ]) {
            c.setProvider(this.provider)

            // Dirty hack for web3@1.0.0 support for localhost testrpc,
            // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
            if (typeof c.currentProvider.sendAsync !== 'function') {
                c.currentProvider.sendAsync = function() {
                    return c.currentProvider.send.apply(
                        c.currentProvider,
                        arguments
                    )
                }
            }
        }

        // Initialize new Contracts
        this.SlotsChannelManager = new SlotsChannelManagerContract(this.web3)
    }

    getTokenInstance = () => {
        return decentBetTokenInstance
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

    getHouseAuthorizedControllerInstance = () => {
        return houseAuthorizedControllerInstance
    }

    getHouseFundsControllerInstance = () => {
        return houseFundsControllerInstance
    }

    getHouseLotteryControllerInstance = () => {
        return houseLotteryControllerInstance
    }

    getHouseSessionsControllerInstance = () => {
        return houseSessionsControllerInstance
    }

    getTokenContract = callback => {
        this.getContract(TYPE_DBET_TOKEN, callback)
    }

    getHouseContract = callback => {
        this.getContract(TYPE_HOUSE, callback)
    }

    getHouseAuthorizedControllerContract = callback => {
        this.getContract(TYPE_HOUSE_AUTHORIZED_CONTROLLER, callback)
    }

    getHouseFundsControllerContract = callback => {
        this.getContract(TYPE_HOUSE_FUNDS_CONTROLLER, callback)
    }

    getHouseLotteryControllerContract = callback => {
        this.getContract(TYPE_HOUSE_LOTTERY_CONTROLLER, callback)
    }

    getHouseSessionsControllerContract = callback => {
        this.getContract(TYPE_HOUSE_SESSIONS_CONTROLLER, callback)
    }

    getBettingProviderContract = callback => {
        this.getContract(TYPE_BETTING_PROVIDER, callback)
    }

    getSlotsChannelFinalizerContract = callback => {
        this.getContract(TYPE_SLOTS_CHANNEL_FINALIZER, callback)
    }

    getSportsOracleContract = callback => {
        this.getContract(TYPE_SPORTS_ORACLE, callback)
    }

    getAllContracts = callback => {
        const self = this
        async.parallel(
            {
                token: callback => {
                    this.getTokenContract(instance => {
                        self.setInstance(TYPE_DBET_TOKEN, instance)
                        callback(null, instance)
                    })
                },
                house: callback => {
                    this.getHouseContract(instance => {
                        self.setInstance(TYPE_HOUSE, instance)
                        callback(null, instance)
                    })
                },
                houseAuthorizedController: callback => {
                    this.getHouseAuthorizedControllerContract(instance => {
                        self.setInstance(
                            TYPE_HOUSE_AUTHORIZED_CONTROLLER,
                            instance
                        )
                        callback(null, instance)
                    })
                },
                houseFundsController: callback => {
                    this.getHouseFundsControllerContract(instance => {
                        self.setInstance(TYPE_HOUSE_FUNDS_CONTROLLER, instance)
                        callback(null, instance)
                    })
                },
                houseLotteryController: callback => {
                    this.getHouseLotteryControllerContract(instance => {
                        self.setInstance(
                            TYPE_HOUSE_LOTTERY_CONTROLLER,
                            instance
                        )
                        callback(null, instance)
                    })
                },
                houseSessionsController: callback => {
                    this.getHouseSessionsControllerContract(instance => {
                        self.setInstance(
                            TYPE_HOUSE_SESSIONS_CONTROLLER,
                            instance
                        )
                        callback(null, instance)
                    })
                },
                bettingProvider: callback => {
                    this.getBettingProviderContract(instance => {
                        self.setInstance(TYPE_BETTING_PROVIDER, instance)
                        callback(null, instance)
                    })
                },
                slotsChannelManager: callback => {
                    self.SlotsChannelManager.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                slotsChannelFinalizer: callback => {
                    this.getSlotsChannelFinalizerContract(instance => {
                        self.setInstance(TYPE_SLOTS_CHANNEL_FINALIZER, instance)
                        callback(null, instance)
                    })
                },
                sportsOracle: callback => {
                    this.getSportsOracleContract(instance => {
                        self.setInstance(TYPE_SPORTS_ORACLE, instance)
                        callback(null, instance)
                    })
                }
            },
            (err, results) => {
                callback(false, results)
            }
        )
    }

    getContract = (type, callback) => {
        const self = this
        let instance = this.getInstance(type)
        if (!instance) {
            console.log('getContract: ' + type)
            this.getContractObject(type)
                .deployed()
                .then(function(_instance) {
                    console.log('Deployed', type, _instance.address)
                    self.setInstance(type, _instance)
                    callback(_instance)
                })
                .catch(function(err) {
                    console.log('Deploy error', type, err.message)
                })
        } else callback(instance)
    }

    getContractObject = type => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetToken
            case TYPE_HOUSE:
                return house
            case TYPE_HOUSE_AUTHORIZED_CONTROLLER:
                return houseAuthorizedController
            case TYPE_HOUSE_FUNDS_CONTROLLER:
                return houseFundsController
            case TYPE_HOUSE_LOTTERY_CONTROLLER:
                return houseLotteryController
            case TYPE_HOUSE_SESSIONS_CONTROLLER:
                return houseSessionsController
            case TYPE_BETTING_PROVIDER:
                return bettingProvider
            case TYPE_SLOTS_CHANNEL_FINALIZER:
                return slotsChannelFinalizer
            case TYPE_SPORTS_ORACLE:
                return sportsOracle
            default:
                return null
        }
    }

    getInstance = type => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetTokenInstance
            case TYPE_HOUSE:
                return houseInstance
            case TYPE_HOUSE_AUTHORIZED_CONTROLLER:
                return houseAuthorizedControllerInstance
            case TYPE_HOUSE_FUNDS_CONTROLLER:
                return houseFundsControllerInstance
            case TYPE_HOUSE_LOTTERY_CONTROLLER:
                return houseLotteryControllerInstance
            case TYPE_HOUSE_SESSIONS_CONTROLLER:
                return houseSessionsControllerInstance
            case TYPE_BETTING_PROVIDER:
                return bettingProviderInstance
            case TYPE_SLOTS_CHANNEL_FINALIZER:
                return slotsChannelFinalizerInstance
            case TYPE_SPORTS_ORACLE:
                return sportsOracleInstance
            default:
                return null
        }
    }

    setInstance = (type, instance) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                decentBetTokenInstance = instance
                break
            case TYPE_HOUSE:
                houseInstance = instance
                break
            case TYPE_HOUSE_AUTHORIZED_CONTROLLER:
                houseAuthorizedController = instance
                break
            case TYPE_HOUSE_FUNDS_CONTROLLER:
                houseFundsControllerInstance = instance
                break
            case TYPE_HOUSE_LOTTERY_CONTROLLER:
                houseLotteryControllerInstance = instance
                break
            case TYPE_HOUSE_SESSIONS_CONTROLLER:
                houseSessionsControllerInstance = instance
                break
            case TYPE_BETTING_PROVIDER:
                bettingProviderInstance = instance
                break
            case TYPE_SLOTS_CHANNEL_FINALIZER:
                slotsChannelFinalizerInstance = instance
                break
            case TYPE_SPORTS_ORACLE:
                sportsOracleInstance = instance
                break
            default:
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
                        return decentBetTokenInstance.allowance.call(
                            owner,
                            spender,
                            {
                                from: this.web3.eth.defaultAccount
                            }
                        )
                    },
                    balanceOf: address => {
                        return decentBetTokenInstance.balanceOf.call(address, {
                            from: this.web3.eth.defaultAccount
                        })
                    },
                    /** Setters */
                    approve: (address, value) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [address, value]
                        )

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

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
                                name: 'faucet',
                                type: 'function',
                                inputs: []
                            },
                            []
                        )

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
                    // Mapping (uint => Session)
                    getSession: sessionNumber => {
                        return houseSessionsControllerInstance.sessions(
                            sessionNumber
                        )
                    },
                    getHouseFunds: sessionNumber => {
                        return houseFundsControllerInstance.houseFunds(
                            sessionNumber
                        )
                    },
                    getUserCreditsForSession: (sessionNumber, address) => {
                        return houseFundsControllerInstance.getUserCreditsForSession.call(
                            sessionNumber,
                            address,
                            {
                                from: this.web3.eth.defaultAccount
                            }
                        )
                    },
                    getAuthorizedAddresses: index => {
                        return houseAuthorizedControllerInstance.authorizedAddresses(
                            index
                        )
                    },
                    addToAuthorizedAddresses: address => {
                        return houseAuthorizedControllerInstance.addToAuthorizedAddresses(
                            address
                        )
                    },
                    removeFromAuthorizedAddresses: address => {
                        return houseAuthorizedControllerInstance.removeFromAuthorizedAddresses(
                            address
                        )
                    },
                    lotteries: session => {
                        return houseLotteryControllerInstance.lotteries(session)
                    },
                    lotteryTicketHolders: (session, ticketNumber) => {
                        return houseLotteryControllerInstance.lotteryTicketHolders(
                            session,
                            ticketNumber
                        )
                    },
                    lotteryUserTickets: (session, address, index) => {
                        return houseLotteryControllerInstance.lotteryUserTickets(
                            session,
                            address,
                            index
                        )
                    },
                    /**
                     * Setters
                     */
                    purchaseCredits: amount => {
                        return houseInstance.purchaseCredits.sendTransaction(
                            amount,
                            {
                                from: this.web3.eth.defaultAccount,
                                gas: 5000000
                            }
                        )
                    },
                    /**
                     * Events
                     */
                    logPurchasedCredits: (
                        sessionNumber,
                        fromBlock,
                        toBlock
                    ) => {
                        return houseInstance.LogPurchasedCredits(
                            {
                                creditHolder: this.web3.eth.defaultAccount,
                                session: sessionNumber
                            },
                            {
                                fromBlock: fromBlock ? fromBlock : 0,
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logLiquidateCredits: (
                        sessionNumber,
                        fromBlock,
                        toBlock
                    ) => {
                        return houseInstance.LogLiquidateCredits(
                            {
                                creditHolder: this.web3.eth.defaultAccount,
                                session: sessionNumber
                            },
                            {
                                fromBlock: fromBlock ? fromBlock : 0,
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
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
                    getGame: id => {
                        return bettingProviderInstance.getGame.call(id)
                    },
                    getGamePeriodBetLimits: (id, period) => {
                        return bettingProviderInstance.getGamePeriodBetLimits(
                            id,
                            period
                        )
                    },
                    getGameMaxBetLimit: id => {
                        return bettingProviderInstance.getGameMaxBetLimit(id)
                    },
                    getGameBettor: (id, index) => {
                        return bettingProviderInstance.getGameBettor(id, index)
                    },
                    getGameBettorBet: (id, address, betId) => {
                        return bettingProviderInstance.getGameBettorBet(
                            id,
                            address,
                            betId
                        )
                    },
                    getGameBettorBetOdds: (id, address, betId) => {
                        return bettingProviderInstance.getGameBettorBetOdds(
                            id,
                            address,
                            betId
                        )
                    },
                    getGameBettorBetOddsDetails: (id, address, betId) => {
                        return bettingProviderInstance.getGameBettorBetOddsDetails(
                            id,
                            address,
                            betId
                        )
                    },
                    getGameOddsCount: id => {
                        return bettingProviderInstance.getGameOddsCount(id)
                    },
                    getGameOdds: (id, oddsId) => {
                        return bettingProviderInstance.getGameOdds(id, oddsId)
                    },
                    getGameOddsDetails: (id, oddsId) => {
                        return bettingProviderInstance.getGameOddsDetails(
                            id,
                            oddsId
                        )
                    },
                    getGameOutcome: (id, period) => {
                        return bettingProviderInstance.getGameOutcome(
                            id,
                            period
                        )
                    },
                    getDepositedTokens: (address, sessionNumber) => {
                        return bettingProviderInstance.depositedTokens(
                            address,
                            sessionNumber
                        )
                    },
                    getSessionStats: sessionNumber => {
                        return bettingProviderInstance.sessionStats(
                            sessionNumber
                        )
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
                        return bettingProviderInstance.getUserBets(
                            address,
                            index
                        )
                    },
                    getBetReturns: (gameId, betId, bettor) => {
                        return bettingProviderInstance.getBetReturns(
                            gameId,
                            betId,
                            bettor
                        )
                    },
                    balanceOf: (address, session) => {
                        console.log(
                            'Retrieving sportsbook balance for',
                            address,
                            session
                        )
                        return bettingProviderInstance.balanceOf(
                            address,
                            session
                        )
                    },
                    /**
                     * Setters
                     */
                    deposit: amount => {
                        console.log(
                            'Depositing',
                            amount,
                            'to sportsbook as',
                            this.web3.eth.defaultAccount
                        )

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
                                name: 'deposit',
                                type: 'function',
                                inputs: [
                                    {
                                        name: 'amount',
                                        type: 'uint256'
                                    }
                                ]
                            },
                            [amount]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    withdraw: (amount, session) => {
                        console.log(
                            'Withdraw',
                            amount,
                            'from sportsbook as',
                            this.web3.eth.defaultAccount
                        )

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [amount, session]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    setSportsOracle: address => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
                                name: 'setSportsOracle',
                                type: 'function',
                                inputs: [
                                    {
                                        name: '_address',
                                        type: 'address'
                                    }
                                ]
                            },
                            [address]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    changeAssistedClaimTimeOffset: offset => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
                                name: 'changeAssistedClaimTimeOffset',
                                type: 'function',
                                inputs: [
                                    {
                                        name: 'offset',
                                        type: 'uint256'
                                    }
                                ]
                            },
                            [offset]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    addGame: (oracleGameId, cutOffTime, endTime) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [oracleGameId, cutOffTime, endTime]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    updateGamePeriodBetLimits: (id, period, limits) => {
                        console.log(
                            'updateGamePeriodBetLimits',
                            id,
                            period,
                            limits
                        )

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [id, period, limits]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    pushGameOdds: (
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
                    ) => {
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

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [
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
                            ]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    updateGameOdds: (
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
                    ) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [
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
                            ]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    updateGameOutcome: (
                        id,
                        period,
                        result,
                        team1Points,
                        team2Points
                    ) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [id, period, result, team1Points, team2Points]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    placeBet: (gameId, oddsId, betType, choice, amount) => {
                        console.log(
                            'Placing bet',
                            gameId,
                            oddsId,
                            betType,
                            choice,
                            amount
                        )

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [gameId, oddsId, betType, choice, amount]
                        )

                        return self.signAndSendRawTransaction(
                            keyHandler.get(),
                            bettingProviderInstance.address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    },
                    claimBet: (gameId, betId, bettor) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
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
                            },
                            [gameId, betId, bettor]
                        )

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
                        return bettingProviderInstance.LogNewGame(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logNewGameOdds: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogNewGameOdds(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logUpdatedGameOdds: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedGameOdds(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logUpdatedMaxBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedMaxBet(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logUpdatedBetLimits: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedBetLimits(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logNewBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogNewBet(
                            {},
                            {
                                bettor: this.web3.eth.defaultAccount,
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logClaimedBet: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogClaimedBet(
                            {},
                            {
                                bettor: this.web3.eth.defaultAccount,
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logDeposit: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogDeposit(
                            {},
                            {
                                _address: this.web3.eth.defaultAccount,
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logWithdraw: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogWithdraw(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logUpdatedTime: (fromBlock, toBlock) => {
                        return bettingProviderInstance.LogUpdatedTime(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
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
                        return this.getWrappers()
                            .token()
                            .balanceOf(sportsOracleInstance.address)
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
                    getAuthorizedAddresses: index => {
                        return sportsOracleInstance.authorizedAddresses(index)
                    },
                    getRequestedProviderAddresses: index => {
                        return sportsOracleInstance.requestedProviderAddresses(
                            index
                        )
                    },
                    getAcceptedProviderAddresses: index => {
                        return sportsOracleInstance.acceptedProviderAddresses(
                            index
                        )
                    },
                    getGamesCount: () => {
                        return sportsOracleInstance.gamesCount()
                    },
                    getGame: gameId => {
                        return sportsOracleInstance.games(gameId)
                    },
                    getAvailableGamePeriods: (gameId, index) => {
                        return sportsOracleInstance.availableGamePeriods(
                            gameId,
                            index
                        )
                    },
                    getGameProvidersUpdateList: (gameId, index) => {
                        return sportsOracleInstance.gameProvidersUpdateList(
                            gameId,
                            index
                        )
                    },
                    getProviderGameToUpdate: (gameId, providerAddress) => {
                        return sportsOracleInstance.providerGamesToUpdate(
                            gameId,
                            providerAddress
                        )
                    },
                    getGamePeriods: (gameId, periodNumber) => {
                        return sportsOracleInstance.gamePeriods(
                            gameId,
                            periodNumber
                        )
                    },
                    getTime: () => {
                        return sportsOracleInstance.getTime()
                    },
                    /**
                     * Events
                     */
                    logNewAuthorizedAddress: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewAuthorizedAddress(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logNewAcceptedProvider: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewAcceptedProvider(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logGameAdded: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogGameAdded(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logGameDetailsUpdate: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogGameDetailsUpdate(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logGameResult: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogGameResult(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logUpdatedProviderOutcome: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogUpdatedProviderOutcome(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logWithdrawal: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogWithdrawal(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logNewGameUpdateCost: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewGameUpdateCost(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logNewProviderAcceptanceCost: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogNewProviderAcceptanceCost(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logUpdatedTime: (fromBlock, toBlock) => {
                        return sportsOracleInstance.LogUpdatedTime(
                            {},
                            {
                                fromBlock: fromBlock ? fromBlock : 'latest',
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    }
                }
            },
            slotsChannelFinalizer: () => {
                return {
                    finalize: (id, userSpin, houseSpin) => {
                        userSpin = self.getSpinParts(userSpin)
                        houseSpin = self.getSpinParts(houseSpin)

                        console.log(
                            'Finalize',
                            id,
                            typeof id,
                            this.web3.eth.defaultAccount
                        )

                        let logKeys = spin => {
                            Object.keys(spin).forEach(key => {
                                console.log(
                                    'Finalize',
                                    key,
                                    spin[key],
                                    typeof spin[key]
                                )
                            })
                        }

                        logKeys(userSpin)
                        logKeys(houseSpin)

                        console.log(
                            'Finalize string: "' +
                                id +
                                '", "' +
                                userSpin.parts +
                                '", "' +
                                houseSpin.parts +
                                '", "' +
                                userSpin.r +
                                '", "' +
                                userSpin.s +
                                '", "' +
                                houseSpin.r +
                                '", "' +
                                houseSpin.s +
                                '"'
                        )

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
                                name: 'finalize',
                                type: 'function',
                                inputs: [
                                    {
                                        name: 'id',
                                        type: 'bytes32'
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
                            },
                            [
                                id,
                                userSpin.parts,
                                houseSpin.parts,
                                userSpin.r,
                                userSpin.s,
                                houseSpin.r,
                                houseSpin.s
                            ]
                        )

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
                return {}
            }
        }
    }

    verifySign = (msg, sign, address) => {
        let sigParams = ethUtil.fromRpcSig(sign)
        let msgHash = ethUtil.sha3(msg)

        let r = sigParams.r
        let s = sigParams.s
        let v = ethUtil.bufferToInt(sigParams.v)

        let publicKeyBuffer = ethUtil.ecrecover(msgHash, v, r, s)
        let publicKey = ethUtil.bufferToHex(publicKeyBuffer)
        publicKey = ethUtil.bufferToHex(ethUtil.pubToAddress(publicKey))

        console.log(
            'Verify sign - Public key',
            publicKey,
            publicKey === address
        )

        return publicKey === address
    }

    getSpinParts = spin => {
        let sign = spin.sign

        let sigParams = ethUtil.fromRpcSig(sign)

        let r = ethUtil.bufferToHex(sigParams.r)
        let s = ethUtil.bufferToHex(sigParams.s)
        let v = ethUtil.bufferToInt(sigParams.v)

        console.log('getSpinParts sig: ', v, r, s)

        console.log('getSpinParts reverse sig: ', ethUtil.toRpcSig(v, r, s))

        return {
            parts:
                spin.reelHash +
                '/' +
                (spin.reel !== '' ? spin.reel.toString() : '') +
                '/' +
                spin.reelSeedHash +
                '/' +
                spin.prevReelSeedHash +
                '/' +
                spin.userHash +
                '/' +
                spin.prevUserHash +
                '/' +
                spin.nonce +
                '/' +
                spin.turn +
                '/' +
                spin.userBalance +
                '/' +
                spin.houseBalance +
                '/' +
                spin.betSize +
                '/' +
                v,
            r: r,
            s: s
        }
    }

    signAndSendRawTransaction = Promise.promisify(
        (privateKey, to, gasPrice, gas, data, callback) => {
            this.web3.eth.getTransactionCount(
                this.web3.eth.defaultAccount,
                'latest',
                (err, count) => {
                    console.log('Tx count', err, count)
                    if (!err) {
                        let nonce = nonceHandler.get(count)

                        let tx = {
                            from: this.web3.eth.defaultAccount,
                            to: to,
                            gas: gas,
                            data: data,
                            nonce: nonce
                        }
                        console.log('Tx', tx)

                        /** If not set, it'll be automatically pulled from the Ethereum network */
                        if (gasPrice) tx.gasPrice = gasPrice
                        else tx.gasPrice = 10000000000

                        ethAccounts.signTransaction(
                            tx,
                            privateKey,
                            (err, res) => {
                                console.log(
                                    'Signed raw tx',
                                    err,
                                    res ? res.rawTransaction : ''
                                )
                                if (!err) {
                                    console.log(this.web3.eth)
                                    this.web3.eth.sendSignedTransaction(
                                        res.rawTransaction,
                                        (err, res) => {
                                            nonceHandler.set(nonce)
                                            callback(err, res)
                                        }
                                    )
                                } else
                                    callback(true, 'Error signing transaction')
                            }
                        )
                    } else callback(true, 'Error retrieving nonce')
                }
            )
        }
    )
}

export default ContractHelper
