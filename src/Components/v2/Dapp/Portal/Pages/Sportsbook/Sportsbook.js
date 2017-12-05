import React, {Component} from 'react'

import {Card, CircularProgress, DropDownMenu, MenuItem, TextField} from 'material-ui'
import ConfirmationDialog from '../../../../Base/ConfirmationDialog'
import DepositTokensDialog from './Dialogs/DepositTokensDialog'

import ArrayCache from '../../../../Base/ArrayCache'
import BettingReturnsCalculator from '../../Modules/BettingReturnsCalculator'
import Helper from '../../../../Helper'

import './sportsbook.css'

const arrayCache = new ArrayCache()
const async = require('async')
const bettingReturnsCalculator = new BettingReturnsCalculator()
const BigNumber = require('bignumber.js')
const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')
const helper = new Helper()
const swarm = require('swarm-js').at("http://swarm-gateways.net")

const IPFS = require('ipfs-mini')
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
const styles = require('../../../../Base/styles').styles()

const DIALOG_CONFIRM_BET = 0, DIALOG_DEPOSIT_TOKENS = 1

class Sportsbook extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            token: {
                balance: 0
            },
            bettingProvider: {
                address: helper.getContractHelper().getBettingProviderInstance().address,
                house: '0x0',
                sportsOracle: '0x0',
                currentSession: 0,
                balance: 0,
                depositedTokens: 0,
                allowance: 0,
                gamesCount: 0,
                games: {},
                placedBets: {}
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
                    acceptedProviderAddresses: [],
                },
                games: {}
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
                }
            }
        }
    }

    componentWillMount = () => {
        this.initBettingProviderData()
        this.initSportsOracleData()
        this.initTokenData()
    }

    initBettingProviderData = () => {
        /** Details */
        this.web3Getters().bettingProvider().currentSession()
        this.web3Getters().bettingProvider().house()
        this.web3Getters().bettingProvider().sportsOracle()
        this.web3Getters().bettingProvider().allowance()
        this.web3Getters().bettingProvider().tokenBalance()

        /** Games */
        this.web3Getters().bettingProvider().gamesCount()
        this.web3Getters().bettingProvider().game(0, true)
        this.web3Getters().bettingProvider().sessionStats(1)
        this.web3Getters().bettingProvider().getUserBets(0)

        /** Events */
        this.watchers().bettingProvider().deposit()
        this.watchers().bettingProvider().newBet()
    }

    initSportsOracleData = () => {
        /** Games */
        this.web3Getters().sportsOracle().games.count()
        this.web3Getters().sportsOracle().games.game(0, true)

        /** Payments */
        this.web3Getters().sportsOracle().payments.gameUpdateCost()

        /** Providers */
        this.web3Getters().sportsOracle().addresses.requestedProviders(0)
        this.web3Getters().sportsOracle().addresses.acceptedProviders(0)
    }

    initTokenData = () => {
        this.web3Getters().token().balance()
    }

    web3Getters = () => {
        const self = this
        return {
            bettingProvider: () => {
                return {
                    gamesCount: () => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getGamesCount().then((gamesCount) => {
                            let bettingProvider = self.state.bettingProvider
                            bettingProvider.gamesCount = gamesCount
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                        }).catch((err) => {
                            console.log('Error retrieving games count for the provider', err.message)
                        })
                    },
                    currentSession: () => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getCurrentSession().then((session) => {
                            let currentSession = session.toNumber()
                            let bettingProvider = self.state.bettingProvider
                            bettingProvider.currentSession = currentSession
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                            self.web3Getters().bettingProvider().depositedTokens(currentSession)
                        }).catch((err) => {
                            console.log('Error retrieving current session', err.message)
                        })
                    },
                    tokenBalance: () => {
                        helper.getContractHelper().getWrappers().token()
                            .balanceOf(helper.getContractHelper().getBettingProviderInstance().address)
                            .then((balance) => {
                                balance = helper.formatEther(balance.toString())
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.balance = balance
                                console.log('Retrieved DBET balance for bettingProvider', balance)
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            }).catch((err) => {
                            console.log('Error retrieving token balance', err.message)
                        })
                    },
                    depositedTokens: (session) => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .balanceOf(helper.getWeb3().eth.defaultAccount, session)
                            .then((balance) => {
                                balance = helper.formatEther(balance.toString())
                                console.log('Deposited tokens', balance)
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.depositedTokens = balance
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            }).catch((err) => {
                            console.log('Error retrieving balance', err.message)
                        })
                    },
                    allowance: () => {
                        const address = helper.getWeb3().eth.defaultAccount
                        const bettingProvider = helper.getContractHelper().getBettingProviderInstance().address
                        helper.getContractHelper().getWrappers().token()
                            .allowance(address, bettingProvider)
                            .then((allowance) => {
                                allowance = allowance.toNumber()
                                console.log('Retrieved allowance for', address, allowance)
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.allowance = allowance
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            }).catch((err) => {
                            console.log('Error retrieving allowance', err.message)
                        })
                    },
                    house: () => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getHouseAddress().then((houseAddress) => {
                            let bettingProvider = self.state.bettingProvider
                            bettingProvider.house = houseAddress
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                        }).catch((err) => {
                            console.log('Error retrieving house address', err.message)
                        })
                    },
                    sportsOracle: () => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getSportsOracleAddress()
                            .then((sportsOracleAddress) => {
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.sportsOracle = sportsOracleAddress
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            }).catch((err) => {
                            console.log('Error retrieving sports oracle address', err.message)
                        })
                    },
                    game: (id, iterate) => {
                        console.log('Retrieving game', id, iterate)
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getGame(id).then((data) => {
                            let exists = data[8]
                            if (exists) {
                                let game = {
                                    oracleGameId: data[0].toNumber(),
                                    session: data[1].toNumber(),
                                    betAmount: data[2].div(ethUnits.units.ether).toString(),
                                    payouts: data[3].toFixed(0),
                                    betCount: data[4].toNumber(),
                                    cutOffTime: data[5].toNumber(),
                                    endTime: data[6].toNumber(),
                                    hasEnded: data[7],
                                    exists: exists,
                                    betLimits: {}
                                }
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.games[id] = game
                                if (exists) {
                                    self.web3Getters().bettingProvider().gameOddsCount(id)
                                    let bettingProvider = self.state.bettingProvider
                                    bettingProvider.games[id] = game
                                    self.setState({
                                        bettingProvider: bettingProvider
                                    })
                                }
                                if (iterate && exists) {
                                    self.web3Getters().bettingProvider().game((id + 1), true)
                                }
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            } else
                                console.log('Reached end of provider games', id, self.state.bettingProvider.games)
                        }).catch((err) => {
                            console.log('Error retrieving game ', id, err.message)
                        })
                    },
                    gameOddsCount: (id) => {
                        console.log('Loading game odds count', id)
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getGameOddsCount(id).then((oddsCount) => {
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
                                self.helpers().loadOddsForGame(id, oddsCount.toNumber())
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                        }).catch((err) => {
                            console.log('Error retrieving game odds count ', id, err.message)
                        })
                    },
                    gameOdds: (gameId, oddsId) => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getGameOdds(gameId, oddsId).then((_odds) => {
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
                            odds[gameId][oddsId].selectedChoice = constants.BET_CHOICE_TEAM1

                            if (!self.state.bettingProvider.games[gameId].betLimits.hasOwnProperty(gameOdds.period))
                                self.web3Getters().bettingProvider().betLimits(gameId, gameOdds.period)

                            if (odds[gameId][oddsId].handicap != 0)
                                odds[gameId][oddsId].handicap /= 100
                            console.log('Loaded odds for game', gameId, oddsId, odds)
                            self.setState({
                                odds: odds
                            })
                        }).catch((err) => {
                            console.log('Error retrieving odds ', oddsId, 'for game', gameId, err.message)
                        })
                    },
                    betLimits: (gameId, period) => {
                        helper.getContractHelper().getWrappers()
                            .bettingProvider().getGamePeriodBetLimits(gameId, period).then((limits) => {
                            console.log('Retrieved bet limits for game', gameId, 'period', period, ':', limits)
                            let betLimits = limits[0]
                            let bettingProvider = self.state.bettingProvider
                            bettingProvider.games[gameId].betLimits[period] = {
                                spread: betLimits[0].div(ethUnits.units.ether).toNumber(),
                                moneyline: betLimits[1].div(ethUnits.units.ether).toNumber(),
                                totals: betLimits[2].div(ethUnits.units.ether).toNumber(),
                                teamTotals: betLimits[3].div(ethUnits.units.ether).toNumber()
                            }
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                        }).catch((err) => {
                            console.log('Error retrieving bet limits', gameId, period, err.message)
                        })
                    },
                    sessionStats: (session) => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getSessionStats(session)
                            .then((stats) => {
                                console.log('Retrieved session stats for session', session, stats)
                            }).catch((err) => {
                            console.log('Error retrieving session stats', err.message)
                        })
                    },
                    getUserBets: (index) => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getUserBets(helper.getWeb3().eth.defaultAccount, index)
                            .then((bets) => {
                                let gameId = bets[0].toNumber()
                                let betId = bets[1].toNumber()
                                let exists = bets[2]

                                if (exists) {
                                    console.log('Retrieved user bets', index, gameId, betId, exists)
                                    self.web3Getters().bettingProvider().getGameBettorBet(gameId, betId)
                                    self.web3Getters().bettingProvider().getUserBets(index + 1)
                                }
                            }).catch((err) => {
                            console.log('Error retrieving user bets', err.message)
                        })
                    },
                    getGameBettorBet: (gameId, betId) => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getGameBettorBet(gameId, helper.getWeb3().eth.defaultAccount, betId)
                            .then((_bet) => {
                                let bet = {
                                    oddsId: _bet[0].toNumber(),
                                    choice: _bet[1].toNumber(),
                                    amount: _bet[2].div(ethUnits.units.ether).toNumber(),
                                    blockTime: _bet[3].toNumber(),
                                    session: _bet[4].toNumber(),
                                    claimed: _bet[5],
                                    exists: _bet[6]
                                }
                                console.log('Retrieved game bet', gameId, betId, bet)

                                let bettingProvider = self.state.bettingProvider
                                if (!bettingProvider.placedBets.hasOwnProperty(gameId))
                                    bettingProvider.placedBets[gameId] = {}
                                bettingProvider.placedBets[gameId][betId] = bet
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            }).catch((err) => {
                            console.log('Error retrieving game bet', gameId, betId, err.message)
                        })
                    }
                }
            },
            sportsOracle: () => {
                return {
                    metadata: (gameId, hash) => {
                        console.log('Retrieving from ipfs', hash)

                        ipfs.catJSON(hash, (err, data) => {
                            console.log('Retrieved data for hash', hash, err, data)
                            if (!err) {
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.games[gameId].team1 = data.team1
                                sportsOracle.games[gameId].team2 = data.team2
                                sportsOracle.games[gameId].starts = data.starts
                                sportsOracle.games[gameId].league = data.league
                                sportsOracle.games[gameId].periodDescriptions = data.periods

                                self.setState({
                                    sportsOracle: sportsOracle
                                })
                            } else {
                                console.log('Error retrieving hash data', hash, err)
                            }
                        })
                    },
                    owner: () => {
                        helper.getContractHelper().getWrappers().sportsOracle().getOwner().then((owner) => {
                            let sportsOracle = self.state.sportsOracle
                            sportsOracle.owner = owner
                            self.setState({
                                sportsOracle: sportsOracle
                            })
                        }).catch((err) => {
                            console.log('Error retrieving owner')
                        })
                    },
                    games: {
                        count: () => {
                            helper.getContractHelper().getWrappers().sportsOracle().getGamesCount().then((gamesCount) => {
                                console.log('Games count:', gamesCount)
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.gamesCount = gamesCount.toNumber()
                                self.setState({
                                    sportsOracle: sportsOracle
                                })
                            }).catch((err) => {
                                console.log('Error retrieving games count:', err)
                            })
                        },
                        game: (id, iterate) => {
                            helper.getContractHelper().getWrappers().sportsOracle().getGame(id).then(
                                (data) => {
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
                                        self.web3Getters().sportsOracle().metadata(id, ipfsHash)
                                    if (exists) {
                                        let sportsOracle = self.state.sportsOracle
                                        sportsOracle.games[id] = game
                                        self.setState({
                                            sportsOracle: sportsOracle
                                        })
                                        self.web3Getters().sportsOracle().games.availableGamePeriods(id, 0)
                                    }
                                    if (iterate && exists)
                                        self.web3Getters().sportsOracle().games.game((id + 1), true)
                                }).catch((err) => {
                                console.log('Error retrieving game', id, err.message)
                            })
                        },
                        availableGamePeriods: (id, index) => {
                            const CACHE_KEY = 'availableGamePeriods_' + id
                            if (index == 0)
                                arrayCache.clear(CACHE_KEY)

                            let updateState = () => {
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.games[id].periods = arrayCache.get(CACHE_KEY)
                                self.setState({
                                    sportsOracle: sportsOracle
                                })
                            }

                            helper.getContractHelper().getWrappers().sportsOracle()
                                .getAvailableGamePeriods(id, index)
                                .then((period) => {
                                    if (arrayCache.get(CACHE_KEY).indexOf(period.toNumber()) == -1) {
                                        arrayCache.add(CACHE_KEY, period.toNumber())
                                        self.web3Getters().sportsOracle().games.availableGamePeriods(id, index + 1)
                                    } else
                                        updateState()
                                }).catch((err) => {
                                console.log('Reached end of available game periods', err.message)
                                updateState()
                            })
                        }
                    },
                    payments: {
                        gameUpdateCost: () => {
                            helper.getContractHelper().getWrappers().sportsOracle()
                                .getGameUpdateCost().then((gameUpdateCost) => {
                                gameUpdateCost = gameUpdateCost.div(ethUnits.units.ether).toNumber()
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.payments.gameUpdateCost = gameUpdateCost
                                self.setState({
                                    sportsOracle: sportsOracle
                                })
                            }).catch((err) => {
                                console.log('Error retrieving game update cost', err.message)
                            })
                        }
                    },
                    addresses: {
                        requestedProviders: (index) => {
                            const CACHE_KEY = 'requestedProviderAddresses'
                            if (index == 0)
                                arrayCache.clear(CACHE_KEY)

                            let getNextRequestedProviders = (address) => {
                                arrayCache.add(CACHE_KEY, address)
                                self.web3Getters().addresses.requestedProviders(index + 1)
                            }

                            let cacheRequestedProviders = () => {
                                if (arrayCache.get(CACHE_KEY).length > 0) {
                                    let sportsOracle = self.state.sportsOracle
                                    sportsOracle.addresses.requestedProviderAddresses = arrayCache.get(CACHE_KEY)
                                    self.setState({
                                        sportsOracle: sportsOracle
                                    })
                                }
                            }

                            helper.getContractHelper().getWrappers().sportsOracle()
                                .getRequestedProviderAddresses(index)
                                .then((address) => {
                                    if (address != '0x')
                                        getNextRequestedProviders(address)
                                    else
                                        cacheRequestedProviders()
                                }).catch((err) => {
                                console.log('Error retrieving requested providers', err.message)
                                cacheRequestedProviders()
                            })
                        },
                        acceptedProviders: (index) => {
                            const CACHE_KEY = 'acceptedProviderAddresses'
                            if (index == 0)
                                arrayCache.clear(CACHE_KEY)

                            let getNextAcceptedProviders = (address) => {
                                arrayCache.add(CACHE_KEY, address)
                                self.web3Getters().addresses.acceptedProviders(index + 1)
                            }

                            let cacheAcceptedProviders = () => {
                                if (arrayCache.get(CACHE_KEY).length > 0) {
                                    let sportsOracle = self.state.sportsOracle
                                    sportsOracle.addresses.acceptedProviderAddresses = arrayCache.get(CACHE_KEY)
                                    self.setState({
                                        sportsOracle: sportsOracle
                                    })
                                }
                            }

                            helper.getContractHelper().getWrappers().sportsOracle().getAcceptedProviderAddresses(index)
                                .then((address) => {
                                    if (address != '0x')
                                        getNextAcceptedProviders(address)
                                    else
                                        cacheAcceptedProviders()
                                }).catch((err) => {
                                console.log('Error retrieving accepted providers', err.message)
                                cacheAcceptedProviders()
                            })
                        }
                    }
                }
            },
            token: () => {
                return {
                    balance: () => {
                        helper.getContractHelper().getWrappers().token()
                            .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                            balance = helper.formatEther(balance.toString())
                            let token = self.state.token
                            token.balance = balance
                            console.log('Retrieved DBET balance', balance)
                            self.setState({
                                token: token
                            })
                        }).catch((err) => {
                            console.log('Error retrieving token balance', err.message)
                        })
                    }
                }
            }
        }
    }

    watchers = () => {
        const self = this
        return {
            bettingProvider: () => {
                return {
                    deposit: () => {
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .logDeposit().watch((err, event) => {
                            console.log('Deposit event', err, JSON.stringify(event))
                        })
                    },
                    newBet: () => {
                        console.log('Watching for new bets')
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .logNewBet(0).watch((err, event) => {
                            console.log('New bet event', err, JSON.stringify(event))
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

                const betAmount = new BigNumber(oddsObj.betAmount).times(ethUnits.units.ether).toString()
                const betType = oddsObj.betType
                const selectedChoice = oddsObj.selectedChoice

                console.log('Placing bet for', oddsObj, oddsObj.betAmount, betAmount, 'DBETs')

                helper.getContractHelper().getWrappers().bettingProvider().placeBet(gameId, oddsId, betType,
                    selectedChoice, betAmount).then((txId) => {
                    console.log('Successfully placed bet', txId)
                    self.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)
                }).catch((err) => {
                    console.log('Error placing bet', err.message)
                })
            },
            depositTokens: (amount) => {
                helper.getContractHelper().getWrappers().bettingProvider().deposit(amount).then((txId) => {
                    console.log('Successfully deposited', amount, 'DBETs', txId)
                }).catch((err) => {
                    console.log('Error depositing tokens', err.message)
                })
            },
            approveAndDepositTokens: (amount) => {
                let bettingProvider = helper.getContractHelper().getBettingProviderInstance().address
                helper.getContractHelper().getWrappers().token().approve(bettingProvider, amount).then((txId) => {
                    console.log('Successfully approved', amount, 'DBETs for ', bettingProvider, txId)
                    self.web3Setters().depositTokens(amount)
                }).catch((err) => {
                    console.log('Error approving dbets', err.message)
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            games: () => {
                let games = []
                Object.keys(self.state.bettingProvider.games).map((gameId) => {
                    let game = self.state.bettingProvider.games[gameId]
                    game.id = gameId
                    games.push(game)
                })
                return <section>
                    {   Object.keys(self.state.bettingProvider.games).length > 0 &&
                    <section>
                        <div className="row">
                            <div className="col-12">
                                <h4 className="text-uppercase">Available Games</h4>
                            </div>
                        </div>
                        { games.map((game, index) =>
                            <Card
                                style={styles.card}
                                className="mt-4">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-11">
                                                {   self.helpers().isTeamNamesAvailable(game.oracleGameId) &&
                                                <p className="mb-1 teams">
                                                    {self.state.sportsOracle.games[game.oracleGameId].team1
                                                    + ' vs ' +
                                                    self.state.sportsOracle.games[game.oracleGameId].team2}
                                                </p>
                                                }
                                                {   !self.helpers().isTeamNamesAvailable(game.oracleGameId) &&
                                                <p className="mb-1">
                                                    Loading team names..
                                                </p>
                                                }
                                            </div>
                                            <div className="col-1">
                                                <small className="float-right">
                                                    {
                                                        '#' + game.oracleGameId}
                                                </small>
                                            </div>
                                            <div className="col-12">
                                                <small>
                                                    {
                                                        'Cut-off time:' +
                                                        new Date(game.cutOffTime * 1000).toLocaleString()
                                                    }
                                                </small>
                                                <br/>
                                                <small>
                                                    {self.helpers().getGameStartTime(game.oracleGameId)}
                                                </small>
                                                <small className="float-right">
                                                    {self.helpers().getLeagueName(game.oracleGameId)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    {   self.state.odds.hasOwnProperty(game.id) &&
                                    <div className="col-12">
                                        <hr/>
                                        <p className="mt-2">Available Odds</p>
                                        {self.views().gameOdds(game.id)}
                                    </div>
                                    }
                                    {   !self.state.odds.hasOwnProperty(game.id) &&
                                    <div className="col-12 game-odds">
                                        <hr/>
                                        <p className="mt-2">Available Odds</p>
                                        {self.views().noAvailableOdds()}
                                    </div>
                                    }
                                    <div className="col-12">
                                        <hr/>
                                        <p className="mt-2">Bet Limits</p>
                                        {self.views().betLimits(game.id)}
                                    </div>
                                    <div className="col-12">
                                        <hr/>
                                        <p className="mt-2">Bet Information</p>
                                        <div className="row mt-4">
                                            <div className="col-4">
                                                <p className="text-center key">Bet Amount</p>
                                                <p className="text-center">{game.betAmount} DBETs</p>
                                            </div>
                                            <div className="col-4">
                                                <p className="text-center key">Bet Count</p>
                                                <p className="text-center">{game.betCount}</p>
                                            </div>
                                            <div className="col-4">
                                                <p className="text-center key">Your bets</p>
                                                <p className="text-center">
                                                    {self.state.bettingProvider.placedBets.hasOwnProperty(game.id) ?
                                                        Object.keys(self.state.bettingProvider.placedBets[game.id]).length :
                                                        0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </section>
                    }
                    { Object.keys(self.state.bettingProvider.games).length == 0 &&
                    <h3 className="text-center mt-4">No available games</h3>
                    }
                </section>
            },
            stats: () => {
                return <section>
                    <div className="row stats">
                        <div className="col-6">
                            <p className="key">Current Session</p>
                            <p>{self.state.bettingProvider.currentSession}</p>
                        </div>
                        <div className="col-6">
                            <p className="key text-center">Deposited Tokens</p>
                            <p>{self.state.bettingProvider.depositedTokens} DBETs</p>
                            <button className="btn btn-primary btn-sm mx-auto"
                                    onClick={() => {
                                        self.helpers().toggleDialog(DIALOG_DEPOSIT_TOKENS, true)
                                    }}>
                                Deposit
                            </button>
                        </div>
                        <div className="col-6">
                            <p className="key">Sportsbook balance</p>
                            <p>{self.state.bettingProvider.balance} DBETs</p>
                        </div>
                    </div>
                </section>
            },
            gameOdds: (gameId) => {
                const odds = self.state.odds[gameId]
                let gameOdds = {
                    spread: [],
                    moneyline: [],
                    totals: [],
                    teamTotals: [],
                }

                Object.keys(odds).forEach((oddsId) => {
                    const _odds = odds[oddsId]
                    if (_odds.betType == constants.ODDS_TYPE_SPREAD) {
                        gameOdds.spread.push(_odds)
                    } else if (_odds.betType == constants.ODDS_TYPE_MONEYLINE) {
                        gameOdds.moneyline.push(_odds)
                    } else if (_odds.betType == constants.ODDS_TYPE_TOTALS) {
                        gameOdds.totals.push(_odds)
                    } else if (_odds.betType == constants.ODDS_TYPE_TEAM_TOTALS) {
                        gameOdds.teamTotals.push(_odds)
                    }
                })

                return <div className="row game-odds">
                    {   gameOdds.spread.length > 0 && self.views().spreadOdds(gameId, gameOdds) }
                    {   gameOdds.moneyline.length > 0 && self.views().moneylineOdds(gameId, gameOdds) }
                    {   gameOdds.totals.length > 0 && self.views().totalsOdds(gameId, gameOdds) }
                    {   gameOdds.teamTotals.length > 0 && self.views().teamTotalsOdds(gameId, gameOdds) }
                    {   Object.keys(odds).length == 0 && self.views().noAvailableOdds()}
                </div>
            },
            spreadOdds: (gameId, gameOdds) => {
                return <div className="col-12">
                    <div className="row">
                        <div className="col-3">
                            <p className="text-center mt-1 type">SPREAD</p>
                        </div>
                        <div className="col-9">
                            {   gameOdds.spread.map((_odds) =>
                                <div className="row">
                                    <div className="col-3">
                                        <p className="key">Handicap</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.handicap)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Home</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.team1)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Away</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.team2)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Period</p>
                                        <p>{self.helpers().getPeriodDescription(gameId, _odds.period)}</p>
                                    </div>
                                    <div className="col-12 mt-1 mb-4">
                                        {self.views().betNow(constants.ODDS_TYPE_SPREAD, gameId, _odds.id)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            },
            moneylineOdds: (gameId, gameOdds) => {
                return <div className="col-12 mt-3">
                    <div className="row">
                        <div className="col-3">
                            <p className="text-center mt-1 type">MONEYLINE</p>
                        </div>
                        <div className="col-9">
                            {   gameOdds.moneyline.map((_odds) =>
                                <div className="row">
                                    <div className="col-3">
                                        <p className="key">Home</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.team1)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Away</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.team2)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Draw</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.draw)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Period</p>
                                        <p>{self.helpers().getPeriodDescription(gameId, _odds.period)}</p>
                                    </div>
                                    <div className="col-12 mt-1 mb-4">
                                        {self.views().betNow(constants.ODDS_TYPE_MONEYLINE, gameId, _odds.id)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            },
            totalsOdds: (gameId, gameOdds) => {
                return <div className="col-12 mt-3">
                    <div className="row">
                        <div className="col-3">
                            <p className="text-center mt-1 type">TOTALS</p>
                        </div>
                        <div className="col-9">
                            {   gameOdds.totals.map((_odds) =>
                                <div className="row">
                                    <div className="col-3">
                                        <p className="key">Points</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.points)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Over</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.over)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Under</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.under)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Period</p>
                                        <p>{self.helpers().getPeriodDescription(gameId, _odds.period)}</p>
                                    </div>
                                    <div className="col-12 mt-1 mb-4">
                                        {self.views().betNow(constants.ODDS_TYPE_TOTALS, gameId, _odds.id)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            },
            teamTotalsOdds: (gameId, gameOdds) => {
                return <div className="col-12 mt-3">
                    <div className="row">
                        <div className="col-3">
                            <p className="text-center mt-1 type">TEAM TOTALS</p>
                        </div>
                        <div className="col-9">
                            {   gameOdds.teamTotals.map((_odds) =>
                                <div className="row mt-1">
                                    <div className="col-2">
                                        <p className="key">Team</p>
                                        <p>{_odds.isTeam1 ? 'Home' : 'Away'}</p>
                                    </div>
                                    <div className="col-2">
                                        <p className="key">Points</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.points)}</p>
                                    </div>
                                    <div className="col-2">
                                        <p className="key">Over</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.over)}</p>
                                    </div>
                                    <div className="col-2">
                                        <p className="key">Under</p>
                                        <p>{self.helpers().formatOddsNumber(_odds.under)}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="key">Period</p>
                                        <p>{self.helpers().getPeriodDescription(gameId, _odds.period)}</p>
                                    </div>
                                    <div className="col-12 mt-1 mb-4">
                                        {self.views().betNow(constants.ODDS_TYPE_TEAM_TOTALS, gameId, _odds.id)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            },
            betNow: (type, gameId, oddsId) => {
                return <div className="row mt-2">
                    <div className="col-4">
                        <TextField
                            floatingLabelText="Bet Amount"
                            fullWidth={true}
                            hintStyle={{color: '#949494'}}
                            inputStyle={styles.textField.inputStyle}
                            floatingLabelStyle={styles.textField.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                            underlineStyle={styles.textField.underlineStyle}
                            underlineFocusStyle={styles.textField.underlineStyle}
                            underlineDisabledStyle={styles.textField.underlineDisabledStyle}
                            type="number"
                            value={self.helpers().doesOddsExist(gameId, oddsId) ?
                                self.state.odds[gameId][oddsId].betAmount : 0}
                            onChange={(event, value) => {
                                let odds = self.state.odds
                                odds[gameId][oddsId].betAmount = value
                                console.log('Changed betAmount', odds)
                                self.setState({
                                    odds: odds
                                })
                            }}
                        />
                    </div>
                    <div className="col-4">
                        <DropDownMenu
                            className="mx-auto mt-3"
                            autoWidth={false}
                            style={{width: '100%'}}
                            value={self.helpers().doesOddsExist(gameId, oddsId) ?
                                self.state.odds[gameId][oddsId].selectedChoice : constants.BET_CHOICE_TEAM1}
                            onChange={(event, index, value) => {
                                let odds = self.state.odds
                                odds[gameId][oddsId].selectedChoice = value
                                self.setState({
                                    odds: odds
                                })
                            }}>
                            <MenuItem
                                value={constants.BET_CHOICE_TEAM1}
                                primaryText={self.helpers().getTeamName(true, gameId)}
                            />
                            <MenuItem
                                value={constants.BET_CHOICE_TEAM2}
                                primaryText={self.helpers().getTeamName(false, gameId)}
                            />
                            {   type == constants.ODDS_TYPE_MONEYLINE &&
                            <MenuItem
                                value={constants.BET_CHOICE_DRAW}
                                primaryText="Draw"
                            />
                            }
                        </DropDownMenu>
                    </div>
                    <div className="col-4 pt-1">
                        <p className="text-center key">MAX WIN</p>
                        <p className="text-center">{self.helpers().getMaxWin(gameId, oddsId)} DBETs</p>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-sm btn-primary mx-auto"
                                disabled={self.state.bettingProvider.games[gameId].cutOffTime <= helper.getTimestamp() ||
                                self.helpers().isEmpty(self.state.odds[gameId][oddsId].betAmount)}
                                onClick={() => {
                                    let dialogs = self.state.dialogs
                                    dialogs.confirmBet.message = self.helpers().getConfirmBetMessage(gameId, oddsId)
                                    dialogs.confirmBet.selectedBet = {
                                        gameId: gameId,
                                        oddsId: oddsId
                                    }
                                    dialogs.confirmBet.open = true
                                    self.setState({
                                        dialogs: dialogs
                                    })
                                }}>
                            BET NOW
                        </button>
                    </div>
                </div>
            },
            noAvailableOdds: () => {
                return <div className="col-12 mt-3">
                    <p className="text-center mt-1 no-odds">NO ODDS AVAILABLE AT THE MOMENT</p>
                </div>
            },
            betLimits: (gameId) => {
                let betLimits = self.state.bettingProvider.games[gameId].betLimits

                return <div className="col-12 bet-limits">
                    {   Object.keys(betLimits).map((period) =>
                        <div className="row">
                            <div className="col-12 mb-3">
                                <p className="text-center key">
                                    PERIOD
                                </p>
                                <p className="text-center">
                                    {self.helpers().getPeriodDescription(gameId, period)}
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    SPREAD
                                </p>
                                <p className="text-center">
                                    {betLimits[period].spread} DBETs
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    MONEYLINE
                                </p>
                                <p className="text-center">
                                    {betLimits[period].moneyline} DBETs
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    TOTALS
                                </p>
                                <p className="text-center">
                                    {betLimits[period].totals} DBETs
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    TEAM TOTALS
                                </p>
                                <p className="text-center">
                                    {betLimits[period].teamTotals} DBETs
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            },
            placedBets: () => {
                return <section className="mt-4">
                    <div className="row">
                        <div className="col-12">
                            <h4 className="text-uppercase">Bets placed</h4>
                        </div>
                        {   Object.keys(self.state.bettingProvider.placedBets).length == 0 &&
                        <div className="col-12">
                            <p className="text-center mt-4">No bets placed</p>
                        </div>
                        }
                        {   Object.keys(self.state.bettingProvider.placedBets).length > 0 &&
                        <div className="col-12">
                            {   Object.keys(self.state.bettingProvider.placedBets).map((gameId) =>
                                <div className="row">
                                    {self.views().gameBets(gameId)}
                                </div>
                            )}
                        </div>
                        }
                    </div>
                </section>
            },
            gameBets: (gameId) => {
                const game = self.state.bettingProvider.games[gameId]
                return <div className="col-12">
                    {   Object.keys(self.state.bettingProvider.placedBets).map((gameId) =>
                        <Card
                            style={styles.card}
                            className="mt-4">
                            <div className="row info">
                                <div className="col-12">
                                    {   self.helpers().isTeamNamesAvailable(game.oracleGameId) &&
                                    <p className="mb-1 teams">
                                        {self.state.sportsOracle.games[game.oracleGameId].team1
                                        + ' vs ' +
                                        self.state.sportsOracle.games[game.oracleGameId].team2}
                                    </p>
                                    }
                                    {   !self.helpers().isTeamNamesAvailable(game.oracleGameId) &&
                                    <p className="mb-1">
                                        Loading team names..
                                    </p>
                                    }
                                </div>
                                <div className="col-12 mt-3">
                                    <table className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Choice</th>
                                            <th>Bet Amount</th>
                                            <th>Session</th>
                                            <th>Claimed</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {   Object.keys(self.state.bettingProvider.placedBets[gameId]).map((betId) =>
                                            <tr>
                                                <th scope="row">{betId}</th>
                                                <td>{self.helpers().getFormattedChoice(gameId,
                                                    self.state.bettingProvider.placedBets[gameId][betId].choice)}
                                                </td>
                                                <td>
                                                    {self.state.bettingProvider.placedBets[gameId][betId].amount} DBETs
                                                </td>
                                                <td>{self.state.bettingProvider.placedBets[gameId][betId].session}</td>
                                                <td>{self.state.bettingProvider.placedBets[gameId][betId].claimed ?
                                                    'Claimed' : 'Unclaimed'}</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            },
            tinyLoader: () => {
                return <CircularProgress
                    size={12}
                    color={ constants.COLOR_ACCENT }
                />
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            confirmBet: () => {
                return <ConfirmationDialog
                    open={self.state.dialogs.confirmBet.open}
                    title={self.state.dialogs.confirmBet.title}
                    message={self.state.dialogs.confirmBet.message}
                    onClick={() => {
                        let selectedBet = self.state.dialogs.confirmBet.selectedBet
                        let gameId = selectedBet.gameId
                        let oddsId = selectedBet.oddsId
                        self.web3Setters().placeBet(gameId, oddsId)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)
                    }}
                />
            },
            depositTokens: () => {
                return <DepositTokensDialog
                    open={self.state.dialogs.depositTokens.open}
                    sessionNumber={self.state.bettingProvider.currentSession}
                    onConfirm={(amount) => {
                        let isAllowanceAvailable = new BigNumber(amount).times(ethUnits.units.ether)
                            .lessThanOrEqualTo(self.state.bettingProvider.allowance)
                        let formattedAmount = new BigNumber(amount).times(ethUnits.units.ether).toString()
                        if (isAllowanceAvailable)
                            self.web3Setters().depositTokens(formattedAmount)
                        else
                            self.web3Setters().approveAndDepositTokens(formattedAmount)
                    }}
                    allowance={self.state.bettingProvider.allowance}
                    balance={self.state.token.balance}
                    toggleDialog={(enabled) => {
                        self.helpers().toggleDialog(DIALOG_DEPOSIT_TOKENS, enabled)
                    }}
                />
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            getGameStatus: (game) => {
                let oracleGame = self.state.sportsOracle.games[game.oracleGameId]
                if (oracleGame && oracleGame.hasOwnProperty('startTime')) {
                    let timestamp = helper.getTimestamp()
                    let startTime = oracleGame.startTime
                    if (timestamp < startTime)
                        return 'Not started'
                    else if (timestamp >= startTime && timestamp < game.endTime)
                        return 'Running'
                    else if (timestamp >= game.endTime)
                        return 'Ended'
                } else
                    return self.views().tinyLoader
            },
            getGamePeriods: (game) => {
                let games = self.state.sportsOracle.games
                return games.hasOwnProperty(game.oracleGameId) &&
                games[game.oracleGameId].hasOwnProperty('periods') ?
                    games[game.oracleGameId].periods.length : 0
            },
            isTeamNamesAvailable: (oracleGameId) => {
                return self.state.sportsOracle.games.hasOwnProperty(oracleGameId) &&
                    self.state.sportsOracle.games[oracleGameId].hasOwnProperty('team1') &&
                    self.state.sportsOracle.games[oracleGameId].hasOwnProperty('team2')
            },
            getGameStartTime: (oracleGameId) => {
                if (!helper.isUndefined(self.helpers().getOracleGame(oracleGameId)))
                    return 'Start time:' +
                        new Date(self.helpers().getOracleGame(oracleGameId).startTime * 1000).toLocaleString()
                else
                    return 'Start time: Loading..'
            },
            getLeagueName: (oracleGameId) => {
                if (!helper.isUndefined(self.helpers().getOracleGame(oracleGameId)))
                    return self.state.sportsOracle.games[oracleGameId].league
                else
                    return 'Loading..'
            },
            getTeamName: (isHome, gameId) => {
                let oracleGameId = self.state.bettingProvider.games[gameId].oracleGameId
                return self.state.sportsOracle.games[oracleGameId][isHome ? 'team1' : 'team2']
            },
            getFormattedChoice: (gameId, choice) => {
                let oracleGameId = self.state.bettingProvider.games[gameId].oracleGameId
                if (choice == constants.BET_CHOICE_TEAM1 || choice == constants.BET_CHOICE_TEAM2) {
                    let isHome = (choice == constants.BET_CHOICE_TEAM1)
                    return self.state.sportsOracle.games[oracleGameId][isHome ? 'team1' : 'team2']
                } else if (choice == constants.BET_CHOICE_DRAW)
                    return 'Draw'
                else if (choice == constants.BET_CHOICE_OVER)
                    return 'Over'
                else if (choice == constants.BET_CHOICE_UNDER)
                    return 'Under'
            },
            loadOddsForGame: (gameId, oddsCount) => {
                let i = 0
                while (i < oddsCount)
                    self.web3Getters().bettingProvider().gameOdds(gameId, i++)
            },
            getPeriodDescription: (gameId, period) => {
                let oracleGameId = self.state.bettingProvider.games[gameId].oracleGameId
                let periodDescription = 'Loading..'
                Object.keys(self.state.sportsOracle.games).forEach((_oracleGameId) => {
                    if (oracleGameId == _oracleGameId) {
                        let game = self.state.sportsOracle.games[_oracleGameId]
                        game.periodDescriptions.forEach((_period) => {
                            if (_period.number == period)
                                periodDescription = _period.description
                        })
                    }
                })
                return periodDescription
            },
            toggleDialog: (type, enabled) => {
                let dialogs = self.state.dialogs
                if (type == DIALOG_CONFIRM_BET)
                    dialogs.confirmBet.open = enabled
                else if (type == DIALOG_DEPOSIT_TOKENS)
                    dialogs.depositTokens.open = enabled
                self.setState({
                    dialogs: dialogs
                })
            },
            getConfirmBetMessage: (gameId, oddsId) => {
                let oddsObj = self.state.odds[gameId][oddsId]
                let betAmount = oddsObj.betAmount
                let selectedChoice = oddsObj.selectedChoice

                return 'You are now placing a bet of ' +
                    oddsObj.betAmount + ' DBETs for ' +
                    self.helpers().getTeamName(true, gameId) + ' vs. ' +
                    self.helpers().getTeamName(false, gameId) + '. Please click OK to confirm your bet'
            },
            getOracleGame: (id) => {
                return self.state.sportsOracle.games[id]
            },
            getMaxWin: (gameId, oddsId) => {
                return bettingReturnsCalculator.getBetReturns(self.state.odds[gameId][oddsId])
            },
            formatOddsNumber: (val) => {
                return (val > 0) ? ('+' + val) : val
            },
            doesOddsExist: (gameId, oddsId) => {
                return (self.state.odds.hasOwnProperty(gameId) && self.state.odds[gameId].hasOwnProperty(oddsId))
            },
            isEmpty: (val) => {
                return (val == 0 || val == '')
            }
        }
    }

    render() {
        const self = this
        return <div className="sportsbook">
            <div className="main pb-4">
                <div className="row">
                    <div className="col-10">
                        <div className="row">
                            <div className="col-8">
                                {self.views().games()}
                                {self.views().placedBets()}
                            </div>
                            <div className="col-4">
                                {self.views().stats()}
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                    </div>
                </div>
                {self.dialogs().confirmBet()}
                {self.dialogs().depositTokens()}
            </div>
        </div>
    }

}

export default Sportsbook