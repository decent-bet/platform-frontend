import React, {Component} from 'react'

import {CircularProgress} from 'material-ui'

import ArrayCache from '../../../../Base/ArrayCache'
import Helper from '../../../../Helper'
import './sportsbook.css'

const arrayCache = new ArrayCache()
const async = require('async')
const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')
const helper = new Helper()
const swarm = require('swarm-js').at("http://swarm-gateways.net")

const IPFS = require('ipfs-mini')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

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
                                }
                                let bettingProvider = self.state.bettingProvider
                                bettingProvider.games[id] = game
                                if (exists) {
                                    let bettingProvider = self.state.bettingProvider
                                    bettingProvider.games[id] = game
                                    self.setState({
                                        bettingProvider: bettingProvider
                                    })
                                    self.web3Getters().bettingProvider().gameOddsCount(id)
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
                            self.setState({
                                bettingProvider: bettingProvider
                            })
                        }).catch((err) => {
                            console.log('Error retrieving game odds count ', id, err.message)
                        })
                    }
                }
            },
            sportsOracle: () => {
                return {
                    metadata: (gameId, hash) => {
                        console.log('Retrieving from ipfs', hash)

                        ipfs.catJSON(hash, (err, data) => {
                            console.log('Retrieved data for hash', hash, err, JSON.stringify(data))
                            if(!err) {
                                let sportsOracle = self.state.sportsOracle
                                sportsOracle.games[gameId].team1 = data.team1
                                sportsOracle.games[gameId].team2 = data.team2
                                sportsOracle.games[gameId].starts = data.starts
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
                                    let swarmHash = data[6]
                                    let exists = data[7]
                                    let game = {
                                        id: id,
                                        refId: data[1],
                                        sportId: data[2].toNumber(),
                                        leagueId: data[3].toNumber(),
                                        startTime: data[4].toNumber(),
                                        endTime: data[5].toNumber(),
                                        swarmHash: swarmHash,
                                        exists: exists
                                    }
                                    if (swarmHash.length > 0)
                                        self.web3Getters().sportsOracle().metadata(id, swarmHash)
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

                            helper.getContractHelper().getWrappers().sportsOracle().getRequestedProviderAddresses(index)
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
                return <div className="row mt-4 pushed-games">
                    <div className="col-12 mt-4">
                        <h4 className="text-left">Available Games</h4>
                        <hr/>
                    </div>
                    <div className="col-12">
                        {   Object.keys(self.state.bettingProvider.games).length > 0 &&
                        <table className="table table-inverse table-responsive">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th className="fit">Game</th>
                                <th className="fit">Bet Amount</th>
                                <th className="fit">Payouts</th>
                                <th className="fit">Odds Count</th>
                                <th className="fit">Bet Count</th>
                                <th className="fit">Cutoff Time</th>
                                <th className="fit">End Time</th>
                                <th className="fit">Status</th>
                                <th className="fit">Periods</th>
                            </tr>
                            </thead>
                            <tbody>
                            { games.map((game, index) =>
                                <tr>
                                    <th scope="row">{game.id}</th>
                                    {   self.helpers().isTeamNamesAvailable(game.oracleGameId) &&
                                    <td className="fit">
                                        {self.state.sportsOracle.games[game.oracleGameId].team1} vs {self.state.sportsOracle.games[game.oracleGameId].team2}
                                    </td>
                                    }
                                    {   !self.helpers().isTeamNamesAvailable(game.oracleGameId) &&
                                    <td className="fit">
                                        Loading team names..
                                    </td>
                                    }
                                    <td className="fit">{game.betAmount}</td>
                                    <td className="fit">{game.payouts}</td>
                                    <td className="fit">{(game.odds && game.odds.count) ? game.odds.count : 0}</td>
                                    <td className="fit">{game.betCount}</td>
                                    <td className="fit">{new Date(game.cutOffTime * 1000).toLocaleString()}</td>
                                    <td className="fit">{new Date(game.endTime * 1000).toLocaleString()}</td>
                                    <td className="fit">{self.helpers().getGameStatus(game)}</td>
                                    <td className="fit">{self.helpers().getGamePeriods(game)}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        }
                        { Object.keys(self.state.bettingProvider.games).length == 0 &&
                        <h1 className="text-center">No available games</h1>
                        }
                    </div>
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
            }
        }
    }

    render() {
        const self = this
        return <div className="sportsbook">
            <div className="container">
                {self.views().games()}
            </div>
        </div>
    }

}

export default Sportsbook