import React, { Component } from 'react'
import { Card } from 'material-ui'
import EventBus from 'eventing-bus'
import Bluebird from 'bluebird'
import Helper from '../../../Helper'
import Iframe from '../../../Base/Iframe'
import SlotsChannelHandler from '../SlotsChannelHandler'
import ChannelOptions from './ChannelOptions'
import ChannelDetail from './ChannelDetail'
import SpinHistory from './SpinHistory'

import './game.css'

const async = require('async')
const styles = require('../../../Base/styles').styles()

const helper = new Helper()
const slotsChannelHandler = new SlotsChannelHandler()

export default class Game extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            aesKey: null,
            info: null,
            houseAuthorizedAddress: null,
            hashes: null,
            nonce: null,
            houseSpins: null,
            lastSpinLoaded: false,
            finalized: false,
            closed: false,
            claimed: {}
        }
    }

    componentWillMount() {
        this.initData()
    }

    initData = () => {
        if (window.web3Loaded) {
            this.initChannel()
            this.initWatchers()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.initChannel()
                this.initWatchers()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initChannel = () => {
        const self = this
        async.series(
            {
                aesKey: cb => {
                    slotsChannelHandler
                        .helpers()
                        .getAesKey(this.state.id, (err, data) => {
                            if (!err) {
                                console.log('Aes key', data)
                                self.setState({
                                    aesKey: data
                                })
                                cb(false)
                            } else cb(true, data)
                        })
                },
                channelDetails: cb => {
                    slotsChannelHandler.getChannelDetails(
                        this.state.id,
                        (err, data) => {
                            if (!err) {
                                console.log('Channel details', data)
                                self.setState({
                                    info: data.info,
                                    houseAuthorizedAddress:
                                        data.houseAuthorizedAddress,
                                    closed: data.closed,
                                    hashes: data.hashes
                                })
                                cb(false)
                            } else cb(true, data)
                        }
                    )
                },
                loadLastSpin: cb => {
                    slotsChannelHandler.loadLastSpin(
                        this.state.id,
                        this.state.hashes,
                        self.state.aesKey,
                        (err, data) => {
                            if (!err) {
                                console.log('Last spin', data)
                                self.initSlotsController()
                                self.setState({
                                    nonce: data.nonce,
                                    houseSpins: data.houseSpins,
                                    userHashes: data.userHashes,
                                    lastSpinLoaded: true
                                })
                                cb(false)
                            } else cb(true, data)
                        }
                    )
                }
            },
            (err, results) => {
                console.log('initChannel', err, results)
            }
        )
    }

    initSlotsController = () => {
        const self = this
        window.slotsController = () => {
            return {
                spin: (betSize, callback) => {
                    slotsChannelHandler.spin(
                        betSize,
                        self.state,
                        (err, msg, lines) => {
                            if (!err) {
                                let nonce = self.state.nonce
                                nonce += 1
                                let houseSpins = self.state.houseSpins
                                houseSpins.push(msg)
                                self.setState({
                                    nonce: nonce,
                                    houseSpins: houseSpins
                                })
                            }
                            callback(err, msg, lines)
                        }
                    )
                },
                balances: () => {
                    let lastHouseSpin =
                        self.state.houseSpins[self.state.houseSpins.length - 1]
                    let nonce = self.state.nonce
                    console.log('Balances', nonce)
                    let userBalance =
                        nonce == 1
                            ? self.state.info.initialDeposit
                            : lastHouseSpin.userBalance
                    let houseBalance =
                        nonce == 1
                            ? self.state.info.initialDeposit
                            : lastHouseSpin.houseBalance
                    return {
                        user: helper.formatEther(userBalance),
                        house: helper.formatEther(houseBalance)
                    }
                }
            }
        }
    }

    initWatchers = () => {
        this.watchers().channelFinalized()
        this.watchers().claimChannelTokens()
    }

    watchers = () => {
        const self = this
        return {
            channelFinalized: () => {
                helper
                    .getContractHelper()
                    .getWrappers()
                    .slotsChannelManager()
                    .logChannelFinalized(self.state.id)
                    .watch((err, event) => {
                        if (!err) {
                            let id = event.args.id.toNumber()
                            if (self.state.id == id)
                                self.setState({
                                    finalized: true
                                })
                        }
                    })
            },
            claimChannelTokens: () => {
                helper
                    .getContractHelper()
                    .getWrappers()
                    .slotsChannelManager()
                    .logClaimChannelTokens(self.state.id)
                    .watch((err, event) => {
                        if (err)
                            console.log('Claim channel tokens event error', err)
                        else {
                            console.log(
                                'Claim channel tokens event',
                                event.args,
                                event.args.id.toString()
                            )
                            let id = event.args.id.toNumber()
                            if (id == self.state.id) {
                                let isHouse = event.args.isHouse
                                let claimed = self.state.claimed
                                claimed[isHouse] = true
                                self.setState({
                                    claimed: claimed
                                })
                            }
                        }
                    })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            spinsHistory: () => {
                let history = []
                let houseSpins = self.state.houseSpins
                houseSpins.map(spin => {
                    let nonce = spin.nonce
                    history.push({
                        nonce: nonce,
                        reelHash: spin.reelHash,
                        reelSeedHash: spin.reelSeedHash,
                        userHash: self.helpers().getUserHashForNonce(nonce),
                        reel: spin.reel,
                        payout: slotsChannelHandler
                            .helpers()
                            .calculateReelPayout(
                                spin.reel,
                                helper.convertToEther(5)
                            ),
                        isValid: true
                    })
                })
                return history
            },
            getUserHashForNonce: nonce => {
                let userHashes = self.state.userHashes
                return userHashes[userHashes.length - nonce]
            }
        }
    }

    onFinalizeListener = async () => {
        try {
            await Bluebird.fromCallback(cb =>
                slotsChannelHandler.finalizeChannel(this.state, cb)
            )
            let message = 'Successfully sent finalize channel transaction'
            helper.toggleSnackbar(message)
        } catch (err) {
            console.log(err.message)
            helper.toggleSnackbar('Error sending finalize channel transaction')
        }
    }

    onClaimListener = async () => {
        try {
            await Bluebird.fromCallback(cb =>
                slotsChannelHandler.claimDbets(this.state, cb)
            )
            helper.toggleSnackbar('Successfully sent claim DBETs transaction')
        } catch (err) {
            console.log('Claim DBETs callback', err)
            helper.toggleSnackbar('Error sending claim DBETs transaction')
        }
    }

    renderGame = () => {
        if (this.state.finalized) {
            return (
                <Card style={styles.card} className="p-4">
                    <h3 className="text-center">
                        The channel has been finalized. Please wait a minute
                        before the channel closes and claiming your DBETs.
                    </h3>
                    <p className="lead text-center mt-2">
                        Final Balance:{' '}
                        {window.slotsController().balances().user}
                    </p>
                </Card>
            )
        } else {
            return (
                <Iframe
                    id="slots-iframe"
                    url={process.env.PUBLIC_URL + '/slots-game'}
                    width="100%"
                    height="600px"
                    display="initial"
                    position="relative"
                    allowFullScreen
                />
            )
        }
    }

    render() {
        if (this.state.lastSpinLoaded) {
            return (
                <main className="slots-game container">
                    <div className="row">
                        <div className="col-12 mx-auto">
                            {this.renderGame()}
                        </div>

                        <div className="col-12 mt-4">
                            <ChannelOptions
                                isClosed={this.state.closed}
                                isClaimed={this.state.claimed}
                                isFinalized={this.state.finalized}
                                onClaimListener={this.onClaimListener}
                                onFinalizeListener={this.onFinalizeListener}
                            />
                        </div>

                        <div className="col-12 mt-4">
                            <ChannelDetail
                                initialDeposit={this.state.info.initialDeposit}
                                hashes={this.state.hashes}
                            />
                        </div>

                        <div className="col-12 my-4">
                            <SpinHistory
                                spinArray={this.helpers().spinsHistory()}
                            />
                        </div>
                    </div>
                </main>
            )
        }
        return null
    }
}
