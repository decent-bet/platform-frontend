import React, { Component, Fragment } from 'react'

import { Card, CircularProgress } from 'material-ui'
import ConfirmationDialog from '../../../Base/Dialogs/ConfirmationDialog'
import DepositTokensDialog from './DepositTokensDialog'
import WithdrawTokensDialog from './WithdrawTokensDialog'
import GamesCard from './GamesCard'
import ArrayCache from '../../../Base/ArrayCache'
import BettingReturnsCalculator from '../BettingReturnsCalculator'
import EventBus from 'eventing-bus'
import Helper from '../../../Helper'

import './sportsbook.css'

const arrayCache = new ArrayCache()
const bettingReturnsCalculator = new BettingReturnsCalculator()
const BigNumber = require('bignumber.js')
const constants = require('../../../Constants')
const ethUnits = require('ethereum-units')
const helper = new Helper()

const IPFS = require('ipfs-mini')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const styles = require('../../../Base/styles').styles()

const DIALOG_CONFIRM_BET = 0,
    DIALOG_DEPOSIT_TOKENS = 1,
    DIALOG_WITHDRAW_TOKENS = 2

export default class Sportsbook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            token: {
                balance: 0
            },
            bettingProvider: {
                address: '',
                house: '0x0',
                sportsOracle: '0x0',
                currentSession: 0,
                balance: 0,
                depositedTokens: 0,
                allowance: 0,
                gamesCount: 0,
                games: {},
                placedBets: {},
                time: null
            },
            sportsOracle: {
                owner: '',
                balance: 0,
                gamesCount: 0,
                payments: {
                    gameUpdateCost: 0,
                    providerAcceptanceCost: 0,
                    payForProviderAcceptance: false
                },
                addresses: {
                    authorizedAddresses: [],
                    requestedProviderAddresses: [],
                    acceptedProviderAddresses: []
                },
                games: {},
                time: null
            },
            leagues: {},
            periodDescriptions: {},
            odds: {},
            betAmounts: {},
            dialogs: {
                confirmBet: {
                    open: false,
                    title: 'Place bet',
                    message: '',
                    selectedBet: {
                        gameId: 0,
                        oddsId: 0
                    }
                },
                depositTokens: {
                    open: false
                },
                withdrawTokens: {
                    open: false
                }
            }
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        if (window.web3Loaded) {
            this.initWeb3Data()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.initWeb3Data()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initWeb3Data = () => {
        this.initBettingProviderData()
        this.initSportsOracleData()
        this.initTokenData()
    }

    initBettingProviderData = () => {
        /** Details */
        this.web3Getters()
            .bettingProvider()
            .address()
        this.web3Getters()
            .bettingProvider()
            .currentSession()
        this.web3Getters()
            .bettingProvider()
            .house()
        this.web3Getters()
            .bettingProvider()
            .sportsOracle()
        this.web3Getters()
            .bettingProvider()
            .allowance()
        this.web3Getters()
            .bettingProvider()
            .tokenBalance()
        this.web3Getters()
            .bettingProvider()
            .getTime()

        /** Games */
        this.web3Getters()
            .bettingProvider()
            .gamesCount()
        this.web3Getters()
            .bettingProvider()
            .game(0, true)
        this.web3Getters()
            .bettingProvider()
            .sessionStats(1)
        this.web3Getters()
            .bettingProvider()
            .getUserBets(0)

        /** Events */
        this.watchers()
            .bettingProvider()
            .deposit()
        this.watchers()
            .bettingProvider()
            .withdraw()
        this.watchers()
            .bettingProvider()
            .newBet()
        this.watchers()
            .bettingProvider()
            .updatedMaxBet()
        this.watchers()
            .bettingProvider()
            .claimedBet()
        this.watchers()
            .bettingProvider()
            .newGame()
        this.watchers()
            .bettingProvider()
            .newGameOdds()
        this.watchers()
            .bettingProvider()
            .updatedBetLimits()
        this.watchers()
            .bettingProvider()
            .updatedGameOdds()
        this.watchers()
            .bettingProvider()
            .updatedTime()
    }

    initSportsOracleData = () => {
        /** Time */
        this.web3Getters()
            .sportsOracle()
            .getTime()

        /** Games */
        this.web3Getters()
            .sportsOracle()
            .games.count()
        this.web3Getters()
            .sportsOracle()
            .games.game(0, true)

        /** Payments */
        this.web3Getters()
            .sportsOracle()
            .payments.gameUpdateCost()

        /** Providers */
        this.web3Getters()
            .sportsOracle()
            .addresses.requestedProviders(0)
        this.web3Getters()
            .sportsOracle()
            .addresses.acceptedProviders(0)

        /** Events */

        this.watchers()
            .sportsOracle()
            .gameAdded()
        this.watchers()
            .sportsOracle()
            .updatedProviderOutcome()
        this.watchers()
            .sportsOracle()
            .updatedTime()
    }

    initTokenData = () => {
        this.web3Getters()
            .token()
            .balance()

        this.watchers()
            .token()
            .transferFrom()
        this.watchers()
            .token()
            .transferTo()
    }

    web3Getters = () => {
        const self = this
        return {
            bettingProvider: () => {
                return {
                    gamesCount: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGamesCount()
                            .then(gamesCount => {
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.gamesCount = gamesCount
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving games count for the provider',
                                    err.message
                                )
                            })
                    },
                    address: () => {
                        self.setState({
                            bettingProvider: Object.assign(
                                self.state.bettingProvider,
                                {
                                    address: helper
                                        .getContractHelper()
                                        .getBettingProviderInstance().address
                                }
                            )
                        })
                    },
                    currentSession: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getCurrentSession()
                            .then(session => {
                                let currentSession = session.toNumber()
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.currentSession = currentSession
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .depositedTokens(currentSession)
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving current session',
                                    err.message
                                )
                            })
                    },
                    tokenBalance: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .token()
                            .balanceOf(
                                helper
                                    .getContractHelper()
                                    .getBettingProviderInstance().address
                            )
                            .then(balance => {
                                balance = helper.formatEther(balance.toString())
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.balance = balance
                                console.log(
                                    'Retrieved DBET balance for bettingProvider',
                                    balance
                                )
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving token balance',
                                    err.message
                                )
                            })
                    },
                    depositedTokens: session => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .balanceOf(
                                helper.getWeb3().eth.defaultAccount,
                                session
                            )
                            .then(balance => {
                                balance = helper.formatEther(balance.toString())
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.depositedTokens = balance
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving balance',
                                    err.message
                                )
                            })
                    },
                    allowance: () => {
                        const address = helper.getWeb3().eth.defaultAccount
                        const bettingProvider = helper
                            .getContractHelper()
                            .getBettingProviderInstance().address
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .token()
                            .allowance(address, bettingProvider)
                            .then(allowance => {
                                allowance = allowance.toNumber()
                                console.log(
                                    'Retrieved allowance for',
                                    address,
                                    allowance
                                )
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.allowance = allowance
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving allowance',
                                    err.message
                                )
                            })
                    },
                    house: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getHouseAddress()
                            .then(houseAddress => {
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.house = houseAddress
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving house address',
                                    err.message
                                )
                            })
                    },
                    sportsOracle: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getSportsOracleAddress()
                            .then(sportsOracleAddress => {
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.sportsOracle = sportsOracleAddress
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving sports oracle address',
                                    err.message
                                )
                            })
                    },
                    game: (id, iterate) => {
                        console.log('Retrieving game', id, iterate)
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGame(id)
                            .then(data => {
                                let exists = data[8]
                                if (exists) {
                                    let game = {
                                        oracleGameId: data[0].toNumber(),
                                        session: data[1].toNumber(),
                                        betAmount: data[2]
                                            .div(ethUnits.units.ether)
                                            .toString(),
                                        payouts: data[3].toFixed(0),
                                        betCount: data[4].toNumber(),
                                        cutOffTime: data[5].toNumber(),
                                        endTime: data[6].toNumber(),
                                        hasEnded: data[7],
                                        exists: exists,
                                        betLimits: {},
                                        outcomes: {},
                                        maxBetLimit: 0
                                    }
                                    let bettingProvider =
                                        self.state.bettingProvider
                                    if (
                                        bettingProvider.games.hasOwnProperty(id)
                                    )
                                        bettingProvider.games[
                                            id
                                        ] = Object.assign(
                                            bettingProvider.games[id],
                                            game
                                        )
                                    else bettingProvider.games[id] = game
                                    if (exists) {
                                        self
                                            .web3Getters()
                                            .bettingProvider()
                                            .gameOddsCount(id)
                                        self
                                            .web3Getters()
                                            .bettingProvider()
                                            .maxBetLimit(id)
                                        let bettingProvider =
                                            self.state.bettingProvider
                                        bettingProvider.games[id] = game
                                        self.setState({
                                            bettingProvider: bettingProvider
                                        })
                                    }
                                    if (iterate && exists) {
                                        self
                                            .web3Getters()
                                            .bettingProvider()
                                            .game(id + 1, true)
                                    }
                                    self.setState({
                                        bettingProvider: bettingProvider
                                    })
                                } else
                                    console.log(
                                        'Reached end of provider games',
                                        id,
                                        self.state.bettingProvider.games
                                    )
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving game ',
                                    id,
                                    err.message
                                )
                            })
                    },
                    gameOddsCount: id => {
                        console.log('Loading game odds count', id)
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGameOddsCount(id)
                            .then(oddsCount => {
                                let bettingProvider = self.state.bettingProvider
                                let game = bettingProvider.games[id]
                                if (!game.odds)
                                    game.odds = {
                                        count: 0,
                                        odds: {}
                                    }
                                game.odds.count = oddsCount.toNumber()
                                bettingProvider.games[id] = game
                                if (oddsCount.toNumber() > 0)
                                    self
                                        .helpers()
                                        .loadOddsForGame(
                                            id,
                                            oddsCount.toNumber()
                                        )
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving game odds count ',
                                    id,
                                    err.message
                                )
                            })
                    },
                    gameOdds: (gameId, oddsId) => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGameOdds(gameId, oddsId)
                            .then(_odds => {
                                let odds = self.state.odds
                                if (!odds.hasOwnProperty(gameId))
                                    odds[gameId] = {}

                                let gameOdds = {
                                    id: oddsId,
                                    betType: _odds[0].toNumber(),
                                    period: _odds[1].toNumber(),
                                    handicap: _odds[2].toNumber(),
                                    team1: _odds[3].toNumber(),
                                    team2: _odds[4].toNumber(),
                                    draw: _odds[5].toNumber(),
                                    points: _odds[6].toNumber(),
                                    over: _odds[7].toNumber(),
                                    under: _odds[8].toNumber(),
                                    isTeam1: _odds[9]
                                }
                                odds[gameId][oddsId] = gameOdds

                                // Default values for odds object
                                odds[gameId][oddsId].betAmount = 0
                                odds[gameId][oddsId].selectedChoice =
                                    gameOdds.betType ==
                                        constants.ODDS_TYPE_SPREAD ||
                                    gameOdds.betType ==
                                        constants.ODDS_TYPE_MONEYLINE
                                        ? constants.BET_CHOICE_TEAM1
                                        : constants.BET_CHOICE_OVER

                                if (
                                    !self.state.bettingProvider.games[
                                        gameId
                                    ].betLimits.hasOwnProperty(gameOdds.period)
                                )
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .betLimits(gameId, gameOdds.period)

                                if (
                                    !self.state.bettingProvider.games[
                                        gameId
                                    ].outcomes.hasOwnProperty(gameOdds.period)
                                )
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .outcomes(gameId, gameOdds.period)

                                if (odds[gameId][oddsId].handicap != 0)
                                    odds[gameId][oddsId].handicap /= 100

                                if (odds[gameId][oddsId].points != 0)
                                    odds[gameId][oddsId].points /= 100

                                console.log(
                                    'Loaded odds for game',
                                    gameId,
                                    oddsId,
                                    odds
                                )
                                self.setState({
                                    odds: odds
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving odds ',
                                    oddsId,
                                    'for game',
                                    gameId,
                                    err.message
                                )
                            })
                    },
                    betLimits: (gameId, period) => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGamePeriodBetLimits(gameId, period)
                            .then(limits => {
                                console.log(
                                    'Retrieved bet limits for game',
                                    gameId,
                                    'period',
                                    period,
                                    ':',
                                    limits
                                )
                                let betLimits = limits[0]
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.games[gameId].betLimits[
                                    period
                                ] = {
                                    spread: betLimits[0]
                                        .div(ethUnits.units.ether)
                                        .toNumber(),
                                    moneyline: betLimits[1]
                                        .div(ethUnits.units.ether)
                                        .toNumber(),
                                    totals: betLimits[2]
                                        .div(ethUnits.units.ether)
                                        .toNumber(),
                                    teamTotals: betLimits[3]
                                        .div(ethUnits.units.ether)
                                        .toNumber()
                                }
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving bet limits',
                                    gameId,
                                    period,
                                    err.message
                                )
                            })
                    },
                    maxBetLimit: gameId => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGameMaxBetLimit(gameId)
                            .then(limit => {
                                const maxBetLimit = helper.formatEther(
                                    limit.toString()
                                )
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.games[
                                    gameId
                                ].maxBetLimit = maxBetLimit
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving max bet limit',
                                    gameId
                                )
                            })
                    },
                    outcomes: (gameId, period) => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGameOutcome(gameId, period)
                            .then(outcome => {
                                outcome = {
                                    result: outcome[0].toNumber(),
                                    totalPoints: outcome[1].toNumber(),
                                    team1Points: outcome[2].toNumber(),
                                    team2Points: outcome[3].toNumber(),
                                    isPublished: outcome[4],
                                    settleTime: outcome[5].toNumber()
                                }
                                console.log(
                                    'Retrieved outcome for game',
                                    gameId,
                                    period,
                                    outcome
                                )
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.games[gameId].outcomes[
                                    period
                                ] = outcome
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving outcomes',
                                    gameId,
                                    period,
                                    err.message
                                )
                            })
                    },
                    sessionStats: session => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getSessionStats(session)
                            .then(stats => {
                                console.log(
                                    'Retrieved session stats for session',
                                    session,
                                    stats
                                )
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving session stats',
                                    err.message
                                )
                            })
                    },
                    getUserBets: index => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getUserBets(
                                helper.getWeb3().eth.defaultAccount,
                                index
                            )
                            .then(bets => {
                                let gameId = bets[0].toNumber()
                                let betId = bets[1].toNumber()
                                let exists = bets[2]

                                if (exists) {
                                    console.log(
                                        'Retrieved user bets',
                                        index,
                                        gameId,
                                        betId,
                                        exists
                                    )
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .getGameBettorBet(gameId, betId)
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .getGameBettorBetOdds(gameId, betId)
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .getBetReturns(gameId, betId)
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .getUserBets(index + 1)
                                }
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving user bets',
                                    err.message
                                )
                            })
                    },
                    getGameBettorBet: (gameId, betId) => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGameBettorBet(
                                gameId,
                                helper.getWeb3().eth.defaultAccount,
                                betId
                            )
                            .then(_bet => {
                                let bet = {
                                    oddsId: _bet[0].toNumber(),
                                    choice: _bet[1].toNumber(),
                                    amount: _bet[2]
                                        .div(ethUnits.units.ether)
                                        .toNumber(),
                                    blockTime: _bet[3].toNumber(),
                                    session: _bet[4].toNumber(),
                                    claimed: _bet[5],
                                    exists: _bet[6]
                                }
                                console.log(
                                    'Retrieved game bet',
                                    gameId,
                                    betId,
                                    bet
                                )

                                let bettingProvider = self.state.bettingProvider
                                if (
                                    !bettingProvider.placedBets.hasOwnProperty(
                                        gameId
                                    )
                                )
                                    bettingProvider.placedBets[gameId] = {}
                                bettingProvider.placedBets[gameId][betId] = bet
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving game bet',
                                    gameId,
                                    betId,
                                    err.message
                                )
                            })
                    },
                    getGameBettorBetOdds: (gameId, betId) => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getGameBettorBetOdds(
                                gameId,
                                helper.getWeb3().eth.defaultAccount,
                                betId
                            )
                            .then(odds => {
                                odds = {
                                    betType: odds[0].toNumber(),
                                    period: odds[1].toNumber(),
                                    handicap: odds[2].toNumber(),
                                    team1: odds[3].toNumber(),
                                    team2: odds[4].toNumber(),
                                    draw: odds[5].toNumber(),
                                    points: odds[6].toNumber(),
                                    over: odds[7].toNumber(),
                                    under: odds[8].toNumber(),
                                    isTeam1: odds[9]
                                }
                                console.log(
                                    'Retrieved game bet odds',
                                    gameId,
                                    betId,
                                    odds
                                )
                            })
                    },
                    getBetReturns: (gameId, betId) => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getBetReturns(
                                gameId,
                                betId,
                                helper.getWeb3().eth.defaultAccount
                            )
                            .then(returns => {
                                console.log(
                                    'Retrieved bet returns',
                                    gameId,
                                    betId,
                                    returns.toNumber()
                                )
                            })
                    },
                    getTime: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .getTime()
                            .then(time => {
                                console.log(
                                    'Retrieved betting provider time',
                                    time.toNumber()
                                )
                                self.setState({
                                    bettingProvider: Object.assign(
                                        self.state.bettingProvider,
                                        {
                                            time: time.toNumber()
                                        }
                                    )
                                })
                            })
                    }
                }
            },
            sportsOracle: () => {
                return {
                    metadata: (gameId, hash) => {
                        ipfs.catJSON(hash, (err, data) => {
                            if (!err) {
                                console.log(
                                    'Retrieved data for hash',
                                    hash,
                                    err,
                                    data
                                )
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.games[gameId].team1 = data.team1
                                sportsOracle.games[gameId].team2 = data.team2
                                sportsOracle.games[gameId].starts = data.starts
                                sportsOracle.games[gameId].league = data.league
                                sportsOracle.games[gameId].periodDescriptions =
                                    data.periods

                                self.setState({
                                    sportsOracle: sportsOracle
                                })
                            } else {
                                console.log(
                                    'Error retrieving hash data',
                                    hash,
                                    err
                                )
                            }
                        })
                    },
                    owner: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .getOwner()
                            .then(owner => {
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.owner = owner
                                self.setState({
                                    sportsOracle: sportsOracle
                                })
                            })
                            .catch(err => {
                                console.log('Error retrieving owner')
                            })
                    },
                    games: {
                        count: () => {
                            helper
                                .getContractHelper()
                                .getWrappers()
                                .sportsOracle()
                                .getGamesCount()
                                .then(gamesCount => {
                                    console.log('Games count:', gamesCount)
                                    let sportsOracle = self.state.sportsOracle
                                    sportsOracle.gamesCount = gamesCount.toNumber()
                                    self.setState({
                                        sportsOracle: sportsOracle
                                    })
                                })
                                .catch(err => {
                                    console.log(
                                        'Error retrieving games count:',
                                        err
                                    )
                                })
                        },
                        game: (id, iterate) => {
                            helper
                                .getContractHelper()
                                .getWrappers()
                                .sportsOracle()
                                .getGame(id)
                                .then(data => {
                                    let ipfsHash = data[6]
                                    let exists = data[7]
                                    let game = {
                                        id: id,
                                        refId: data[1],
                                        sportId: data[2].toNumber(),
                                        leagueId: data[3].toNumber(),
                                        startTime: data[4].toNumber(),
                                        endTime: data[5].toNumber(),
                                        ipfsHash: ipfsHash,
                                        exists: exists
                                    }
                                    if (ipfsHash.length > 0)
                                        self
                                            .web3Getters()
                                            .sportsOracle()
                                            .metadata(id, ipfsHash)
                                    if (exists) {
                                        let sportsOracle =
                                            self.state.sportsOracle
                                        sportsOracle.games[id] = game
                                        self.setState({
                                            sportsOracle: sportsOracle
                                        })
                                        self
                                            .web3Getters()
                                            .sportsOracle()
                                            .games.availableGamePeriods(id, 0)
                                    }
                                    if (iterate && exists)
                                        self
                                            .web3Getters()
                                            .sportsOracle()
                                            .games.game(id + 1, true)
                                })
                                .catch(err => {
                                    console.log(
                                        'Error retrieving game',
                                        id,
                                        err.message
                                    )
                                })
                        },
                        availableGamePeriods: (id, index) => {
                            const CACHE_KEY = 'availableGamePeriods_' + id
                            if (index == 0) arrayCache.clear(CACHE_KEY)

                            let updateState = () => {
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.games[id].periods = arrayCache.get(
                                    CACHE_KEY
                                )
                                self.setState({
                                    sportsOracle: sportsOracle
                                })
                            }

                            helper
                                .getContractHelper()
                                .getWrappers()
                                .sportsOracle()
                                .getAvailableGamePeriods(id, index)
                                .then(period => {
                                    if (
                                        arrayCache
                                            .get(CACHE_KEY)
                                            .indexOf(period.toNumber()) == -1
                                    ) {
                                        arrayCache.add(
                                            CACHE_KEY,
                                            period.toNumber()
                                        )
                                        self
                                            .web3Getters()
                                            .sportsOracle()
                                            .games.availableGamePeriods(
                                                id,
                                                index + 1
                                            )
                                    } else updateState()
                                })
                                .catch(err => {
                                    console.log(
                                        'Reached end of available game periods',
                                        err.message
                                    )
                                    updateState()
                                })
                        }
                    },
                    payments: {
                        gameUpdateCost: () => {
                            helper
                                .getContractHelper()
                                .getWrappers()
                                .sportsOracle()
                                .getGameUpdateCost()
                                .then(gameUpdateCost => {
                                    gameUpdateCost = gameUpdateCost
                                        .div(ethUnits.units.ether)
                                        .toNumber()
                                    let sportsOracle = self.state.sportsOracle
                                    sportsOracle.payments.gameUpdateCost = gameUpdateCost
                                    self.setState({
                                        sportsOracle: sportsOracle
                                    })
                                })
                                .catch(err => {
                                    console.log(
                                        'Error retrieving game update cost',
                                        err.message
                                    )
                                })
                        }
                    },
                    addresses: {
                        requestedProviders: index => {
                            const CACHE_KEY = 'requestedProviderAddresses'
                            if (index == 0) arrayCache.clear(CACHE_KEY)

                            let getNextRequestedProviders = address => {
                                arrayCache.add(CACHE_KEY, address)
                                self
                                    .web3Getters()
                                    .addresses.requestedProviders(index + 1)
                            }

                            let cacheRequestedProviders = () => {
                                if (arrayCache.get(CACHE_KEY).length > 0) {
                                    let sportsOracle = self.state.sportsOracle
                                    sportsOracle.addresses.requestedProviderAddresses = arrayCache.get(
                                        CACHE_KEY
                                    )
                                    self.setState({
                                        sportsOracle: sportsOracle
                                    })
                                }
                            }

                            helper
                                .getContractHelper()
                                .getWrappers()
                                .sportsOracle()
                                .getRequestedProviderAddresses(index)
                                .then(address => {
                                    if (address != '0x')
                                        getNextRequestedProviders(address)
                                    else cacheRequestedProviders()
                                })
                                .catch(err => {
                                    console.log(
                                        'Error retrieving requested providers',
                                        err.message
                                    )
                                    cacheRequestedProviders()
                                })
                        },
                        acceptedProviders: index => {
                            const CACHE_KEY = 'acceptedProviderAddresses'
                            if (index == 0) arrayCache.clear(CACHE_KEY)

                            let getNextAcceptedProviders = address => {
                                arrayCache.add(CACHE_KEY, address)
                                self
                                    .web3Getters()
                                    .addresses.acceptedProviders(index + 1)
                            }

                            let cacheAcceptedProviders = () => {
                                if (arrayCache.get(CACHE_KEY).length > 0) {
                                    let sportsOracle = self.state.sportsOracle
                                    sportsOracle.addresses.acceptedProviderAddresses = arrayCache.get(
                                        CACHE_KEY
                                    )
                                    self.setState({
                                        sportsOracle: sportsOracle
                                    })
                                }
                            }

                            helper
                                .getContractHelper()
                                .getWrappers()
                                .sportsOracle()
                                .getAcceptedProviderAddresses(index)
                                .then(address => {
                                    if (address != '0x')
                                        getNextAcceptedProviders(address)
                                    else cacheAcceptedProviders()
                                })
                                .catch(err => {
                                    console.log(
                                        'Error retrieving accepted providers',
                                        err.message
                                    )
                                    cacheAcceptedProviders()
                                })
                        }
                    },
                    getTime: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .getTime()
                            .then(time => {
                                console.log(
                                    'Retrieved sports oracle time',
                                    time.toNumber()
                                )
                                self.setState({
                                    sportsOracle: Object.assign(
                                        self.state.sportsOracle,
                                        {
                                            time: time.toNumber()
                                        }
                                    )
                                })
                            })
                    }
                }
            },
            token: () => {
                return {
                    balance: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .token()
                            .balanceOf(helper.getWeb3().eth.defaultAccount)
                            .then(balance => {
                                balance = helper.formatEther(balance.toString())
                                let token = self.state.token
                                token.balance = balance
                                console.log('Retrieved DBET balance', balance)
                                self.setState({
                                    token: token
                                })
                            })
                            .catch(err => {
                                console.log(
                                    'Error retrieving token balance',
                                    err.message
                                )
                            })
                    }
                }
            }
        }
    }

    watchers = () => {
        const self = this
        return {
            token: () => {
                return {
                    transferFrom: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .token()
                            .logTransfer(self.state.address, true)
                            .watch((err, event) => {
                                if (!err)
                                    self
                                        .web3Getters()
                                        .token()
                                        .balance()
                            })
                    },
                    transferTo: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .token()
                            .logTransfer(self.state.address, false)
                            .watch((err, event) => {
                                if (!err)
                                    self
                                        .web3Getters()
                                        .token()
                                        .balance()
                            })
                    }
                }
            },
            bettingProvider: () => {
                return {
                    deposit: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logDeposit()
                            .watch((err, event) => {
                                console.log('Deposit event', err, event)
                                const amount = event.args.amount.toString()
                                const session = event.args.session.toNumber()

                                helper.toggleSnackbar(
                                    'DBETs deposited into sportsbook contract - ' +
                                        helper.formatEther(amount) +
                                        ' DBETs'
                                )

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .tokenBalance()
                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .depositedTokens(session)
                            })
                    },
                    withdraw: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logWithdraw()
                            .watch((err, event) => {
                                console.log('Withdraw event', err, event)
                                const amount = event.args.amount.toString()
                                const session = event.args.session.toNumber()

                                helper.toggleSnackbar(
                                    'DBETs withdrawn from sportsbook contract - ' +
                                        helper.formatEther(amount) +
                                        ' DBETs'
                                )

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .tokenBalance()
                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .depositedTokens(session)
                            })
                    },
                    newBet: () => {
                        console.log('Watching for new bets')
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logNewBet()
                            .watch((err, event) => {
                                console.log(
                                    'New bet event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.gameId.toNumber()
                                let betId = event.args.betId.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'New bet placed for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .game(gameId, false)
                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .getUserBets(betId)

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .tokenBalance()
                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .depositedTokens(
                                        self.state.bettingProvider
                                            .currentSession
                                    )
                            })
                    },
                    newGame: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logNewGame()
                            .watch((err, event) => {
                                console.log(
                                    'New game event',
                                    err,
                                    JSON.stringify(event)
                                )

                                helper.toggleSnackbar(
                                    'New game available for betting'
                                )

                                let id = event.args.id.toNumber()
                                this.web3Getters()
                                    .bettingProvider()
                                    .game(id, false)
                            })
                    },
                    newGameOdds: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logNewGameOdds()
                            .watch((err, event) => {
                                console.log(
                                    'New game odds event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()
                                let oddsId = event.args.oddsId.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'New odds available for betting - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .gameOddsCount(gameId)
                            })
                    },
                    updatedGameOdds: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedGameOdds()
                            .watch((err, event) => {
                                console.log(
                                    'Updated game odds event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()
                                let oddsId = event.args.oddsId.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Odds updated for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .gameOddsCount(gameId)
                            })
                    },
                    updatedMaxBet: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedMaxBet()
                            .watch((err, event) => {
                                console.log(
                                    'Updated max bet event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Updated max bet for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .maxBetLimit(gameId)
                            })
                    },
                    updatedBetLimits: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedBetLimits()
                            .watch((err, event) => {
                                console.log(
                                    'Updated bet limits event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()
                                let period = event.args.period.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Updated bet limits for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                if (
                                    !self.state.bettingProvider.games[
                                        gameId
                                    ].betLimits.hasOwnProperty(period)
                                )
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .betLimits(gameId, period)
                            })
                    },
                    claimedBet: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logClaimedBet()
                            .watch((err, event) => {
                                console.log(
                                    'Claimed bet event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.gameId.toNumber()
                                let session = event.args.session.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Claimed bet for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .tokenBalance()
                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .depositedTokens(session)
                                self
                                    .web3Getters()
                                    .bettingProvider()
                                    .getUserBets(0)
                            })
                    },
                    updatedTime: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedTime()
                            .watch((err, event) => {
                                console.log(
                                    'Updated provider time event',
                                    err,
                                    event
                                )
                                let time = event.args.time.toNumber()
                                self.setState({
                                    bettingProvider: Object.assign(
                                        self.state.bettingProvider,
                                        {
                                            time: time
                                        }
                                    )
                                })
                            })
                    }
                }
            },
            sportsOracle: () => {
                return {
                    gameAdded: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .logGameAdded()
                            .watch((err, event) => {
                                console.log(
                                    'Game added event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let id = event.args.id.toNumber()
                                this.web3Getters()
                                    .sportsOracle()
                                    .games.game(id, false)
                            })
                    },
                    updatedProviderOutcome: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .logUpdatedProviderOutcome()
                            .watch((err, event) => {
                                console.log(
                                    'Updated provider outcome event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let providerGameId = event.args.providerGameId.toNumber()
                                let period = event.args.period.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, providerGameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, providerGameId)

                                helper.toggleSnackbar(
                                    'Results pushed for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                if (
                                    !self.state.bettingProvider.games[
                                        providerGameId
                                    ].outcomes.hasOwnProperty(period)
                                )
                                    self
                                        .web3Getters()
                                        .bettingProvider()
                                        .outcomes(providerGameId, period)
                            })
                    },
                    updatedTime: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .logUpdatedTime()
                            .watch((err, event) => {
                                console.log(
                                    'Updated oracle time event',
                                    err,
                                    event
                                )
                                let time = event.args.time.toNumber()
                                self.setState({
                                    bettingProvider: Object.assign(
                                        self.state.bettingProvider,
                                        {
                                            time: time
                                        }
                                    )
                                })
                            })
                    }
                }
            }
        }
    }

    web3Setters = () => {
        const self = this
        return {
            placeBet: (gameId, oddsId) => {
                const oddsObj = self.state.odds[gameId][oddsId]

                const betAmount = new BigNumber(oddsObj.betAmount)
                    .times(ethUnits.units.ether)
                    .toFixed()
                const betType = oddsObj.betType
                const selectedChoice = oddsObj.selectedChoice

                console.log(
                    'Placing bet for',
                    oddsObj,
                    oddsObj.betAmount,
                    betAmount,
                    'DBETs'
                )

                helper
                    .getContractHelper()
                    .getWrappers()
                    .bettingProvider()
                    .placeBet(
                        gameId,
                        oddsId,
                        betType,
                        selectedChoice,
                        betAmount
                    )
                    .then(txHash => {
                        console.log('Successfully placed bet', txHash)
                        helper.toggleSnackbar(
                            'Successfully sent place bet transaction'
                        )
                        self.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)
                    })
                    .catch(err => {
                        console.log('Error placing bet', err.message)
                        helper.toggleSnackbar(
                            'Error sending place bet transaction'
                        )
                    })
            },
            depositTokens: amount => {
                helper
                    .getContractHelper()
                    .getWrappers()
                    .bettingProvider()
                    .deposit(amount)
                    .then(txHash => {
                        console.log(
                            'Successfully deposited',
                            amount,
                            'DBETs',
                            txHash
                        )
                        helper.toggleSnackbar(
                            'Successfully sent deposit transaction'
                        )
                    })
                    .catch(err => {
                        console.log('Error depositing tokens', err.message)
                        helper.toggleSnackbar(
                            'Error sending deposit transaction'
                        )
                    })
            },
            withdrawTokens: (amount, session) => {
                helper
                    .getContractHelper()
                    .getWrappers()
                    .bettingProvider()
                    .withdraw(amount, session)
                    .then(txHash => {
                        console.log(
                            'Successfully withdrew',
                            amount,
                            'DBETs',
                            txHash
                        )
                        helper.toggleSnackbar(
                            'Successfully sent withdraw transaction'
                        )
                    })
                    .catch(err => {
                        console.log('Error withdrawing tokens', err.message)
                        helper.toggleSnackbar(
                            'Error sending withdraw transaction'
                        )
                    })
            },
            approveAndDepositTokens: amount => {
                let bettingProvider = helper
                    .getContractHelper()
                    .getBettingProviderInstance().address
                console.log('approveAndDepositTokens', amount, typeof amount)
                helper
                    .getContractHelper()
                    .getWrappers()
                    .token()
                    .approve(bettingProvider, amount)
                    .then(txHash => {
                        console.log(
                            'Successfully approved',
                            amount,
                            'DBETs for ',
                            bettingProvider,
                            txHash
                        )
                        helper.toggleSnackbar(
                            'Successfully sent approve transaction'
                        )
                        self.web3Setters().depositTokens(amount)
                        return null
                    })
                    .catch(err => {
                        console.log('Error approving dbets', err.message)
                        helper.toggleSnackbar(
                            'Error sending approve transaction'
                        )
                    })
            },
            claimBet: (gameId, betId) => {
                helper
                    .getContractHelper()
                    .getWrappers()
                    .bettingProvider()
                    .claimBet(
                        gameId,
                        betId,
                        helper.getWeb3().eth.defaultAccount
                    )
                    .then(txHash => {
                        let bettingProvider = self.state.bettingProvider
                        let bet = bettingProvider.placedBets[gameId][betId]
                        bet.claimed = true
                        self.setState({
                            bettingProvider: bettingProvider
                        })
                        console.log('Successfully sent claim bet tx', txHash)
                        helper.toggleSnackbar(
                            'Successfully sent claim bet transaction'
                        )
                    })
                    .catch(err => {
                        console.log('Error sending claim bet tx', err.message)
                        helper.toggleSnackbar(
                            'Error sending claim bet transaction'
                        )
                    })
            }
        }
    }

    views = () => {
        const self = this
        return {
            stats: () => {
                return (
                    <section>
                        <Card style={styles.card} className="mt-4 p-4">
                            <div className="row stats">
                                <div className="col-12 mb-4">
                                    <h4 className="text-uppercase text-center">
                                        Sportsbook Stats
                                    </h4>
                                </div>
                                <div className="col-6">
                                    <p className="key">Current Session</p>
                                    <p>
                                        {
                                            self.state.bettingProvider
                                                .currentSession
                                        }
                                    </p>
                                </div>
                                <div className="col-6">
                                    <p className="key text-center">
                                        Your Session Balance
                                    </p>
                                    <p>
                                        {
                                            self.state.bettingProvider
                                                .depositedTokens
                                        }{' '}
                                        DBETs
                                    </p>
                                    <button
                                        className="btn btn-primary btn-sm mx-auto px-2"
                                        onClick={() => {
                                            self
                                                .helpers()
                                                .toggleDialog(
                                                    DIALOG_DEPOSIT_TOKENS,
                                                    true
                                                )
                                        }}
                                    >
                                        Deposit
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm mx-auto mt-2"
                                        onClick={() => {
                                            self
                                                .helpers()
                                                .toggleDialog(
                                                    DIALOG_WITHDRAW_TOKENS,
                                                    true
                                                )
                                        }}
                                    >
                                        Withdraw
                                    </button>
                                </div>
                                <div className="col-6">
                                    <p className="key">Sportsbook balance</p>
                                    <p>
                                        {helper.commafy(
                                            self.state.bettingProvider.balance
                                        )}{' '}
                                        DBETs
                                    </p>
                                </div>
                                {self.state.bettingProvider.depositedTokens ==
                                    0 && (
                                    <div className="col-12 mt-4">
                                        <p className="text-danger text-center text-uppercase small">
                                            Please deposit tokens into the
                                            sportsbook contract before placing
                                            any bets
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </section>
                )
            },
            placedBets: () => {
                return (
                    <section className="mt-4">
                        <Card style={styles.card} className="mt-4 p-4">
                            <div className="row">
                                <div className="col-12">
                                    <h4 className="text-uppercase">
                                        Bets placed
                                    </h4>
                                    <hr />
                                </div>
                                {Object.keys(
                                    self.state.bettingProvider.placedBets
                                ).length == 0 && (
                                    <div className="col-12">
                                        <p className="text-center mt-4">
                                            No bets placed
                                        </p>
                                    </div>
                                )}
                                {Object.keys(
                                    self.state.bettingProvider.placedBets
                                ).length > 0 && (
                                    <div className="col-12">
                                        {Object.keys(
                                            self.state.bettingProvider
                                                .placedBets
                                        ).map(gameId => (
                                            <div className="row">
                                                {self.views().gameBets(gameId)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </section>
                )
            },
            gameBets: gameId => {
                const game = self.state.bettingProvider.games[gameId]
                if (game)
                    return (
                        <div className="col-12">
                            <Card style={styles.card} className="mt-4 p-4">
                                <div className="row info">
                                    <div className="col-12">
                                        {game.hasOwnProperty('oracleGameId') &&
                                            self
                                                .helpers()
                                                .isTeamNamesAvailable(
                                                    game.oracleGameId
                                                ) && (
                                                <p className="mb-1 teams">
                                                    {self.state.sportsOracle
                                                        .games[
                                                        game.oracleGameId
                                                    ].team1 +
                                                        ' vs ' +
                                                        self.state.sportsOracle
                                                            .games[
                                                            game.oracleGameId
                                                        ].team2}
                                                </p>
                                            )}
                                        {!game ||
                                            !game.hasOwnProperty(
                                                'oracleGameId'
                                            ) ||
                                            (!self
                                                .helpers()
                                                .isTeamNamesAvailable(
                                                    game.oracleGameId
                                                ) && (
                                                <p className="mb-1">
                                                    Loading team names..
                                                </p>
                                            ))}
                                    </div>
                                    <div className="col-12 mt-3">
                                        <table className="table table-striped table-responsive">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Period</th>
                                                    <th>Odds</th>
                                                    <th>Choice</th>
                                                    <th>Bet Amount</th>
                                                    <th>Session</th>
                                                    <th>Claimed</th>
                                                    <th>Result</th>
                                                    <th>Winnings</th>
                                                    <th>Options</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(
                                                    self.state.bettingProvider
                                                        .placedBets[gameId]
                                                ).map(betId => {
                                                    return self
                                                        .views()
                                                        .gameBet(gameId, betId)
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )
                else return <div />
            },
            gameBet: (gameId, betId) => {
                const placedBet =
                    self.state.bettingProvider.placedBets[gameId][betId]
                const oddsObj = self.state.odds[gameId]
                    ? self.state.odds[gameId][placedBet.oddsId]
                    : null
                if (oddsObj)
                    return (
                        <tr>
                            <td scope="row">{betId}</td>
                            <td>
                                {self
                                    .helpers()
                                    .getPeriodDescription(
                                        gameId,
                                        oddsObj.period
                                    )}
                            </td>
                            <td>
                                {self
                                    .helpers()
                                    .getFormattedOdds(gameId, placedBet.oddsId)}
                            </td>
                            <td>
                                {self
                                    .helpers()
                                    .getFormattedChoice(
                                        gameId,
                                        placedBet.choice
                                    )}
                            </td>
                            <td>{placedBet.amount} DBETs</td>
                            <td>{placedBet.session}</td>
                            <td>
                                {placedBet.claimed ? 'Claimed' : 'Unclaimed'}
                            </td>
                            <td>
                                {self
                                    .helpers()
                                    .getGameOutcome(gameId, oddsObj.period)}
                            </td>
                            <td>
                                {self
                                    .helpers()
                                    .getWinnings(
                                        gameId,
                                        oddsObj,
                                        placedBet
                                    )}{' '}
                                DBETs
                            </td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    disabled={
                                        !self
                                            .helpers()
                                            .isGameOutcomeAvailable(
                                                gameId,
                                                oddsObj.period
                                            ) ||
                                        self
                                            .helpers()
                                            .getWinnings(
                                                gameId,
                                                oddsObj,
                                                placedBet
                                            ) == 0 ||
                                        placedBet.claimed
                                    }
                                    onClick={() => {
                                        self
                                            .web3Setters()
                                            .claimBet(gameId, betId)
                                    }}
                                >
                                    Claim Winnings
                                </button>
                            </td>
                        </tr>
                    )
                else return <p className="text-center">Loading..</p>
            },
            tinyLoader: () => {
                return (
                    <CircularProgress
                        size={12}
                        color={constants.COLOR_ACCENT}
                    />
                )
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            getGameStatus: game => {
                let oracleGame =
                    self.state.sportsOracle.games[game.oracleGameId]
                if (oracleGame && oracleGame.hasOwnProperty('startTime')) {
                    let timestamp = helper.getTimestamp()
                    let startTime = oracleGame.startTime
                    if (timestamp < startTime) return 'Not started'
                    else if (timestamp >= startTime && timestamp < game.endTime)
                        return 'Running'
                    else if (timestamp >= game.endTime) return 'Ended'
                } else return self.views().tinyLoader
            },
            getGamePeriods: game => {
                let games = self.state.sportsOracle.games
                return games.hasOwnProperty(game.oracleGameId) &&
                    games[game.oracleGameId].hasOwnProperty('periods')
                    ? games[game.oracleGameId].periods.length
                    : 0
            },
            isTeamNamesAvailable: oracleGameId => {
                return (
                    self.state.sportsOracle.games.hasOwnProperty(
                        oracleGameId
                    ) &&
                    self.state.sportsOracle.games[oracleGameId].hasOwnProperty(
                        'team1'
                    ) &&
                    self.state.sportsOracle.games[oracleGameId].hasOwnProperty(
                        'team2'
                    )
                )
            },
            getGameStartTime: oracleGameId => {
                if (
                    !helper.isUndefined(
                        self.helpers().getOracleGame(oracleGameId)
                    )
                )
                    return (
                        'Start time:' +
                        new Date(
                            self.helpers().getOracleGame(oracleGameId)
                                .startTime * 1000
                        ).toLocaleString()
                    )
                else return 'Start time: Loading..'
            },
            getLeagueName: oracleGameId => {
                if (
                    !helper.isUndefined(
                        self.helpers().getOracleGame(oracleGameId)
                    )
                )
                    return self.state.sportsOracle.games[oracleGameId].league
                else return 'Loading..'
            },
            getTeamName: (isHome, gameId) => {
                let oracleGameId =
                    self.state.bettingProvider.games[gameId].oracleGameId
                return self.state.sportsOracle.games[oracleGameId]
                    ? self.state.sportsOracle.games[oracleGameId][
                          isHome ? 'team1' : 'team2'
                      ]
                    : 'Loading..'
            },
            getFormattedChoice: (gameId, choice) => {
                let oracleGameId =
                    self.state.bettingProvider.games[gameId].oracleGameId
                if (
                    choice == constants.BET_CHOICE_TEAM1 ||
                    choice == constants.BET_CHOICE_TEAM2
                ) {
                    let isHome = choice == constants.BET_CHOICE_TEAM1
                    return self.state.sportsOracle.games[oracleGameId][
                        isHome ? 'team1' : 'team2'
                    ]
                } else if (choice == constants.BET_CHOICE_DRAW) return 'Draw'
                else if (choice == constants.BET_CHOICE_OVER) return 'Over'
                else if (choice == constants.BET_CHOICE_UNDER) return 'Under'
            },
            getGameOutcome: (gameId, period) => {
                if (!self.helpers().isGameOutcomeAvailable(gameId, period))
                    return 'Not Published'
                else {
                    let outcome =
                        self.state.bettingProvider.games[gameId].outcomes[
                            period
                        ]
                    return outcome
                        ? self
                              .helpers()
                              .getFormattedChoice(gameId, outcome.result) +
                              ', ' +
                              outcome.team1Points +
                              ':' +
                              outcome.team2Points +
                              ', Total: ' +
                              outcome.totalPoints
                        : 'Loading..'
                }
            },
            getWinnings: (gameId, oddsObj, placedBet) => {
                let period = oddsObj.period
                if (!self.helpers().isGameOutcomeAvailable(gameId, period))
                    return 0
                else {
                    let outcome =
                        self.state.bettingProvider.games[gameId].outcomes[
                            period
                        ]

                    if (outcome) {
                        let choice = placedBet.choice
                        let betAmount = placedBet.amount
                        console.log('getWinnings', outcome, placedBet, oddsObj)

                        if (
                            self
                                .helpers()
                                .isWinningBet(gameId, oddsObj, placedBet)
                        ) {
                            let teamOdds =
                                choice == constants.BET_CHOICE_TEAM1
                                    ? oddsObj.team1
                                    : oddsObj.team2

                            if (oddsObj.betType == constants.ODDS_TYPE_SPREAD)
                                return bettingReturnsCalculator
                                    .getSpreadReturns(
                                        betAmount,
                                        oddsObj.handicap,
                                        outcome.team1Points,
                                        outcome.team2Points,
                                        placedBet.choice,
                                        teamOdds
                                    )
                                    .toFixed(2)
                            else
                                return bettingReturnsCalculator.getMaxReturns(
                                    oddsObj,
                                    choice,
                                    betAmount
                                )
                        } else return 0
                    } else return 0
                }
            },
            isGameOutcomeAvailable: (gameId, period) => {
                let outcome =
                    self.state.bettingProvider.games[gameId].outcomes[period]
                return outcome ? outcome.isPublished : 'Loading..'
            },
            getFormattedOddsType: type => {
                switch (type) {
                    case constants.ODDS_TYPE_SPREAD:
                        return constants.FORMATTED_ODDS_TYPE_SPREAD
                    case constants.ODDS_TYPE_MONEYLINE:
                        return constants.FORMATTED_ODDS_TYPE_MONEYLINE
                    case constants.ODDS_TYPE_TOTALS:
                        return constants.FORMATTED_ODDS_TYPE_TOTALS
                    case constants.ODDS_TYPE_TEAM_TOTALS:
                        return constants.FORMATTED_ODDS_TYPE_TEAM_TOTALS
                }
            },
            getFormattedOdds: (gameId, oddsId) => {
                let oddsObj = self.state.odds[gameId][oddsId]
                let formattedOddsType = self
                    .helpers()
                    .getFormattedOddsType(oddsObj.betType)
                if (oddsObj.betType == constants.ODDS_TYPE_SPREAD) {
                    return (
                        formattedOddsType +
                        ' - Hdp: ' +
                        oddsObj.handicap +
                        ', Home: ' +
                        oddsObj.team1 +
                        ', Away: ' +
                        oddsObj.team2
                    )
                } else if (oddsObj.betType == constants.ODDS_TYPE_MONEYLINE) {
                    return (
                        formattedOddsType +
                        ', Home: ' +
                        oddsObj.team1 +
                        ', Away: ' +
                        oddsObj.team2 +
                        ', Draw: ' +
                        oddsObj.draw
                    )
                } else if (
                    oddsObj.betType == constants.ODDS_TYPE_TOTALS ||
                    oddsObj.betType == constants.ODDS_TYPE_TEAM_TOTALS
                ) {
                    return (
                        formattedOddsType +
                        ', Points: ' +
                        oddsObj.points +
                        ', Over: ' +
                        oddsObj.over +
                        ', Under: ' +
                        oddsObj.under
                    )
                }
            },
            loadOddsForGame: (gameId, oddsCount) => {
                let i = 0
                while (i < oddsCount)
                    self
                        .web3Getters()
                        .bettingProvider()
                        .gameOdds(gameId, i++)
            },
            toggleDialog: (type, enabled) => {
                let dialogs = self.state.dialogs
                switch (type) {
                    case DIALOG_CONFIRM_BET:
                        dialogs.confirmBet.open = enabled
                        break
                    case DIALOG_DEPOSIT_TOKENS:
                        dialogs.depositTokens.open = enabled
                        break
                    case DIALOG_WITHDRAW_TOKENS:
                        dialogs.withdrawTokens.open = enabled
                        break
                }
                self.setState({ dialogs: dialogs })
            },
            getOracleGame: id => {
                return self.state.sportsOracle.games[id]
            },
            getMaxWin: (gameId, oddsId) => {
                let oddsObj = self.state.odds[gameId][oddsId]
                return bettingReturnsCalculator.getMaxReturns(
                    oddsObj,
                    oddsObj.selectedChoice,
                    oddsObj.betAmount
                )
            },
            doesOddsExist: (gameId, oddsId) => {
                return (
                    self.state.odds.hasOwnProperty(gameId) &&
                    self.state.odds[gameId].hasOwnProperty(oddsId)
                )
            },
            isEmpty: val => {
                return val == 0 || val == ''
            },
            exceedsMaxBetAmount: (gameId, oddsId) => {
                let totalBetAmount =
                    parseInt(self.state.odds[gameId][oddsId].betAmount) +
                    parseInt(self.state.bettingProvider.games[gameId].betAmount)
                let maxBetLimit = parseInt(
                    self.state.bettingProvider.games[gameId].maxBetLimit
                )
                return totalBetAmount > maxBetLimit
            },
            exceedsBetLimits: (gameId, oddsId) => {
                //*Deprecated */
                let betAmount = parseInt(
                    self.state.odds[gameId][oddsId].betAmount
                )
                let betType = self.state.odds[gameId][oddsId].betType
                let period = self.state.odds[gameId][oddsId].period
                let betLimits =
                    self.state.bettingProvider.games[gameId].betLimits[period]
                let limit
                if (betType == constants.ODDS_TYPE_SPREAD)
                    limit = betLimits.spread
                else if (betType == constants.ODDS_TYPE_MONEYLINE)
                    limit = betLimits.moneyline
                else if (betType == constants.ODDS_TYPE_TOTALS)
                    limit = betLimits.totals
                else if (betType == constants.ODDS_TYPE_TEAM_TOTALS)
                    limit = betLimits.teamTotals
                console.log(
                    'exceedsBetLimits',
                    betAmount,
                    limit,
                    betAmount > limit
                )
                return betAmount > limit
            },
            isGameBettingPeriodOver: id => {
                let game = self.state.bettingProvider.games[id]
                return (
                    self.state.bettingProvider.time != null &&
                    game.cutOffTime < self.state.bettingProvider.time
                )
            },
            isWinningBet: (gameId, oddsObj, placedBet) => {
                let period = oddsObj.period
                let outcome =
                    self.state.bettingProvider.games[gameId].outcomes[period]
                let choice = placedBet.choice
                let result = outcome.result

                if (oddsObj.betType == constants.ODDS_TYPE_SPREAD) {
                    return (
                        (choice == constants.BET_CHOICE_TEAM1 &&
                            outcome.team1Points + oddsObj.handicap >
                                outcome.team2Points) ||
                        (choice == constants.BET_CHOICE_TEAM2 &&
                            outcome.team2Points + oddsObj.handicap >
                                outcome.team1Points)
                    )
                } else {
                    if (
                        (oddsObj.betType == constants.ODDS_TYPE_MONEYLINE &&
                            choice == result) ||
                        oddsObj.betType == constants.ODDS_TYPE_TEAM_TOTALS
                    )
                        return true
                    else if (
                        oddsObj.betType == constants.ODDS_TYPE_TOTALS &&
                        outcome.totalPoints > oddsObj.points &&
                        placedBet.choice == constants.BET_CHOICE_OVER
                    )
                        return true
                    else if (
                        oddsObj.betType == constants.ODDS_TYPE_TOTALS &&
                        outcome.totalPoints < oddsObj.points &&
                        placedBet.choice == constants.BET_CHOICE_UNDER
                    )
                        return true
                    else if (
                        oddsObj.betType == constants.ODDS_TYPE_TEAM_TOTALS &&
                        outcome.team1Points > oddsObj.team1 &&
                        placedBet.choice == constants.BET_CHOICE_OVER
                    )
                        return true
                    else if (
                        oddsObj.betType == constants.ODDS_TYPE_TEAM_TOTALS &&
                        outcome.team1Points < oddsObj.team1 &&
                        placedBet.choice == constants.BET_CHOICE_UNDER
                    )
                        return true
                    else if (
                        oddsObj.betType == constants.ODDS_TYPE_TEAM_TOTALS &&
                        outcome.team2Points > oddsObj.team2 &&
                        placedBet.choice == constants.BET_CHOICE_OVER
                    )
                        return true
                    else if (
                        oddsObj.betType == constants.ODDS_TYPE_TEAM_TOTALS &&
                        outcome.team2Points < oddsObj.team2 &&
                        placedBet.choice == constants.BET_CHOICE_UNDER
                    )
                        return true
                    else return false
                }
            }
        }
    }

    onConfirmBetListener = () => {
        let selectedBet = this.state.dialogs.confirmBet.selectedBet
        let gameId = selectedBet.gameId
        let oddsId = selectedBet.oddsId
        this.web3Setters().placeBet(gameId, oddsId)
    }

    onConfirmDepositListener = amount => {
        let bigAllowance = new BigNumber(amount).times(ethUnits.units.ether)
        let isAllowanceAvailable = bigAllowance.isLessThanOrEqualTo(
            this.state.bettingProvider.allowance
        )
        let formattedAmount = bigAllowance.toFixed()
        isAllowanceAvailable
            ? this.web3Setters().depositTokens(formattedAmount)
            : this.web3Setters().approveAndDepositTokens(formattedAmount)
    }

    onSetBetAmountListener = (gameId, oddsId, betAmount) => {
        let odds = this.state.odds
        odds[gameId][oddsId].betAmount = betAmount
        console.log('Changed betAmount', odds, gameId, oddsId)
        this.setState({ odds: odds })
    }

    onSetBetTeamListener = (gameId, oddsId, value) => {
        let odds = this.state.odds
        odds[gameId][oddsId].selectedChoice = value
        this.setState({ odds: odds })
    }

    onSetTeamTotalListener = (gameId, oddsId, value) => {
        let odds = this.state.odds
        odds[gameId][oddsId].selectedChoice = value
        this.setState({ odds: odds })
    }

    onToggleWithdrawDialog = enabled => {
        this.helpers().toggleDialog(DIALOG_WITHDRAW_TOKENS, enabled)
    }

    onToggleDepositDialogListener = enabled => {
        this.helpers().toggleDialog(DIALOG_DEPOSIT_TOKENS, enabled)
    }

    onCloseConfirmBetDialogListener = () =>
        this.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)

    onOpenConfirmBetDialogListener = (gameId, oddsId) => {
        let dialogs = this.state.dialogs
        let oddsObj = this.state.odds[gameId][oddsId]

        dialogs.confirmBet.message =
            'You are now placing a bet of ' +
            oddsObj.betAmount +
            ' DBETs for ' +
            this.helpers().getTeamName(true, gameId) +
            ' vs. ' +
            this.helpers().getTeamName(false, gameId) +
            '. Please click OK to confirm your bet'

        dialogs.confirmBet.selectedBet = {
            gameId: gameId,
            oddsId: oddsId
        }
        dialogs.confirmBet.open = true
        this.setState({ dialogs: dialogs })
    }

    onWithdrawListener = amount => {
        let formattedAmount = new BigNumber(amount)
            .times(ethUnits.units.ether)
            .toFixed()
        this.web3Setters().withdrawTokens(
            formattedAmount,
            this.state.bettingProvider.currentSession
        )
    }

    renderDialogs = () => (
        <Fragment>
            <ConfirmationDialog
                open={this.state.dialogs.confirmBet.open}
                title={this.state.dialogs.confirmBet.title}
                message={this.state.dialogs.confirmBet.message}
                onClick={this.onConfirmBetListener}
                onClose={this.onCloseConfirmBetDialogListener}
            />
            <DepositTokensDialog
                open={this.state.dialogs.depositTokens.open}
                sessionNumber={this.state.bettingProvider.currentSession}
                onConfirm={this.onConfirmDepositListener}
                allowance={this.state.bettingProvider.allowance}
                balance={this.state.token.balance}
                toggleDialog={this.onToggleDepositDialogListener}
            />
            <WithdrawTokensDialog
                open={this.state.dialogs.withdrawTokens.open}
                sessionNumber={this.state.bettingProvider.currentSession}
                onConfirm={this.onWithdrawListener}
                balance={this.state.bettingProvider.depositedTokens}
                toggleDialog={this.onToggleWithdrawDialog}
            />
        </Fragment>
    )

    renderGamesCard = () => (
        <GamesCard
            bettingProvider={this.state.bettingProvider}
            sportsOracle={this.state.sportsOracle}
            oddsMap={this.state.odds}
            onSetBetAmountListener={this.onSetBetAmountListener}
            onSetBetTeamListener={this.onSetBetTeamListener}
            onSetTeamTotalListener={this.onSetTeamTotalListener}
            onOpenConfirmBetDialogListener={this.onOpenConfirmBetDialogListener}
            depositedTokens={this.state.bettingProvider.depositedTokens}
        />
    )

    render() {
        const self = this
        return (
            <div className="sportsbook">
                <div className="main pb-4">
                    <div className="row">
                        <div className="col-10">
                            <div className="row">
                                <div className="col-8">
                                    {this.renderGamesCard()}
                                    {self.views().placedBets()}
                                </div>
                                <div className="col-4">
                                    {self.views().stats()}
                                </div>
                            </div>
                        </div>
                        <div className="col-2" />
                    </div>
                    {this.renderDialogs()}
                </div>
            </div>
        )
    }
}
