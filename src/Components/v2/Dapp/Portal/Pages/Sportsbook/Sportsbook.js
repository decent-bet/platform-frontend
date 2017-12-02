import React, {Component} from 'react'

import {Card, CircularProgress} from 'material-ui'

import ArrayCache from '../../../../Base/ArrayCache'
import Helper from '../../../../Helper'
import SportsAPI from '../../../../Base/SportsAPI'

import './sportsbook.css'

const arrayCache = new ArrayCache()
const async = require('async')
const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')
const helper = new Helper()
const sportsApi = new SportsAPI()
const swarm = require('swarm-js').at("http://swarm-gateways.net")

const IPFS = require('ipfs-mini')
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
const styles = require('../../../../Base/styles').styles()

class Sportsbook extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            bettingProvider: {
                address: helper.getContractHelper().getBettingProviderInstance().address,
                house: '0x0',
                sportsOracle: '0x0',
                currentSession: 0,
                gamesCount: 0,
                games: {}
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
            odds: {}
        }
    }

    componentWillMount = () => {
        this.initBettingProviderData()
        this.initSportsOracleData()
    }

    initBettingProviderData = () => {
        /** Details */
        this.web3Getters().bettingProvider().currentSession()
        this.web3Getters().bettingProvider().house()
        this.web3Getters().bettingProvider().sportsOracle()

        /** Games */
        this.web3Getters().bettingProvider().gamesCount()
        this.web3Getters().bettingProvider().game(0, true)
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
                            let bettingProvider = self.state.bettingProvider
                            bettingProvider.currentSession = session.toNumber()
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                        }).catch((err) => {
                            console.log('Error retrieving current session', err.message)
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
                        helper.getContractHelper().getWrappers().bettingProvider()
                            .getGame(id).then((data) => {
                            let exists = data[8]
                            if (exists) {
                                let game = {
                                    oracleGameId: data[0].toNumber(),
                                    session: data[1].toNumber(),
                                    betAmount: data[2].toFixed(0),
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
                                if (iterate && exists)
                                    self.web3Getters().bettingProvider().game((id + 1), true)
                                self.setState({
                                    bettingProvider: bettingProvider
                                })
                            } else
                                console.log('Reached end of provider games: ', id)
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
                                spread: betLimits[0].toNumber(),
                                moneyline: betLimits[1].toNumber(),
                                totals: betLimits[2].toNumber(),
                                teamTotals: betLimits[3].toNumber(),
                            }
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                        }).catch((err) => {
                            console.log('Error retrieving bet limits', gameId, period, err.message)
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
                return <div className="row">
                    <div className="col-10">
                        <div className="row">
                            <div className="col-12">
                                <h4 className="text-uppercase">Available Games</h4>
                            </div>
                            <div className="col-8">
                                {   Object.keys(self.state.bettingProvider.games).length > 0 &&
                                <section>
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
                                                                {
                                                                    'Start time:' +
                                                                    new Date(self.helpers().getOracleGame(game.oracleGameId)
                                                                            .startTime * 1000).toLocaleString()
                                                                }
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
                                            </div>
                                        </Card>
                                    )}
                                </section>
                                }
                                { Object.keys(self.state.bettingProvider.games).length == 0 &&
                                <h3 className="text-center mt-4">No available games</h3>
                                }
                            </div>
                            <div className="col-4">
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                    </div>
                </div>
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
                                        {self.views().betNow(constants.ODDS_TYPE_SPREAD, gameId)}
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
                                        {self.views().betNow(constants.ODDS_TYPE_MONEYLINE, gameId)}
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
                                        {self.views().betNow(constants.ODDS_TYPE_TOTALS, gameId)}
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
                                        {self.views().betNow(constants.ODDS_TYPE_TEAM_TOTALS, gameId)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            },
            betNow: (type, gameId) => {
                return <button className="btn btn-sm btn-primary mx-auto"
                               disabled={self.state.bettingProvider.games[gameId].cutOffTime <= helper.getTimestamp()}>
                    BET NOW
                </button>
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
                                <p className="text-center">
                                    {self.helpers().getPeriodDescription(gameId, period)}
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    SPREAD
                                </p>
                                <p className="text-center">
                                    {betLimits[period].spread}
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    MONEYLINE
                                </p>
                                <p className="text-center">
                                    {betLimits[period].moneyline}
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    TOTALS
                                </p>
                                <p className="text-center">
                                    {betLimits[period].totals}
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="text-center key">
                                    TEAM TOTALS
                                </p>
                                <p className="text-center">
                                    {betLimits[period].teamTotals}
                                </p>
                            </div>
                        </div>
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
            getLeagueName: (oracleGameId) => {
                return self.state.sportsOracle.games[oracleGameId].league
            },
            loadOddsForGame: (gameId, oddsCount) => {
                let i = 0
                while (i < oddsCount) {
                    self.web3Getters().bettingProvider().gameOdds(gameId, i)
                    i++
                }
            },
            getPeriodDescription: (gameId, period) => {
                let oracleGameId = self.state.bettingProvider.games[gameId].oracleGameId
                let periodDescription = 'Loading..'
                console.log('getPeriodDescription', self.state.sportsOracle.games)
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
            getOracleGame: (id) => {
                return self.state.sportsOracle.games[id]
            },
            formatOddsNumber: (val) => {
                return (val > 0) ? ('+' + val) : val
            }
        }
    }

    render() {
        const self = this
        return <div className="sportsbook">
            <div className="main pb-4">
                {self.views().games()}
            </div>
        </div>
    }

}

export default Sportsbook