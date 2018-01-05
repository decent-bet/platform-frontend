import React, {Component} from 'react'

import {Card, FlatButton, MuiThemeProvider} from 'material-ui'

const queryString = require('query-string')

import EventBus from 'eventing-bus'
import Helper from '../../../Helper'
import Iframe from '../../../Base/Iframe'
import SlotsChannelHandler from './Libraries/SlotsChannelHandler'
import Themes from '../../../Base/Themes'

const async = require('async')
const styles = require('../../../Base/styles').styles()
const themes = new Themes()

const helper = new Helper()
const slotsChannelHandler = new SlotsChannelHandler()

import './game.css'

class Game extends Component {

    constructor(props) {
        super(props)
        const query = queryString.parse(location.search)
        this.state = {
            id: query.id,
            aesKey: null,
            info: null,
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
        async.series({
            aesKey: (cb) => {
                slotsChannelHandler.helpers().getAesKey(this.state.id, (err, data) => {
                    if (!err) {
                        console.log('Aes key', data)
                        self.setState({
                            aesKey: data
                        })
                        cb(false)
                    } else
                        cb(true, data)
                })
            },
            channelDetails: (cb) => {
                slotsChannelHandler.getChannelDetails(this.state.id, (err, data) => {
                    if (!err) {
                        console.log('Channel details', data)
                        self.setState({
                            info: data.info,
                            closed: data.closed,
                            hashes: data.hashes
                        })
                        cb(false)
                    } else
                        cb(true, data)
                })
            },
            loadLastSpin: (cb) => {
                slotsChannelHandler.loadLastSpin(this.state.id, this.state.hashes, self.state.aesKey, (err, data) => {
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
                    } else
                        cb(true, data)
                })
            }
        }, (err, results) => {
            console.log('initChannel', err, results)
        })
    }

    initSlotsController = () => {
        const self = this
        window.slotsController = () => {
            return {
                spin: (betSize, callback) => {
                    slotsChannelHandler.spin(betSize, self.state, (err, msg, lines) => {
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
                    })
                },
                balances: () => {
                    let lastHouseSpin = self.state.houseSpins[self.state.houseSpins.length - 1]
                    let nonce = self.state.nonce
                    console.log('Balances', nonce)
                    let userBalance = ((nonce == 1) ? (self.state.info.initialDeposit) :
                        lastHouseSpin.userBalance)
                    let houseBalance = ((nonce == 1) ? (self.state.info.initialDeposit) :
                        lastHouseSpin.houseBalance)
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
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logChannelFinalized(self.state.id).watch((err, event) => {
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
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logClaimChannelTokens(self.state.id).watch((err, event) => {
                    if (err)
                        console.log('Claim channel tokens event error', err)
                    else {
                        console.log('Claim channel tokens event', event.args, event.args.id.toString())
                        let id = event.args.id.toNumber()
                        if(id == self.state.id) {
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
                houseSpins.map((spin) => {
                    let nonce = spin.nonce
                    history.push({
                        nonce: nonce,
                        reelHash: spin.reelHash,
                        reelSeedHash: spin.reelSeedHash,
                        userHash: self.helpers().getUserHashForNonce(nonce),
                        reel: spin.reel,
                        payout: slotsChannelHandler.helpers().calculateReelPayout(spin.reel, helper.convertToEther(5)),
                        isValid: true
                    })
                })
                return history
            },
            getUserHashForNonce: (nonce) => {
                let userHashes = self.state.userHashes
                return userHashes[userHashes.length - nonce]
            }
        }
    }

    views = () => {
        const self = this
        return {
            game: () => {
                return <div className="col-12 mx-auto">
                    {   !self.state.finalized &&
                    <Iframe
                        id="slots-iframe"
                        url={ process.env.PUBLIC_URL + '/slots-game' }
                        width="100%"
                        height="600px"
                        display="initial"
                        position="relative"
                        allowFullScreen/>
                    }
                    {   self.state.finalized &&
                    <h3 className="text-center">The channel has been finalized.
                        Please wait a minute before the channel closes and claiming your DBETs.</h3>
                    }
                    {   self.state.finalized &&
                    <p className="lead">Final Balance: { slotsController().balances().user }</p>
                    }
                </div>
            },
            channelOptions: () => {
                return <div className="col-12 mt-4">
                    <Card style={styles.card} className="p-4">
                        <div className="row channel-options">
                            <div className="col-12">
                                <h3 className="text-center text-uppercase mb-3">Channel Options</h3>
                            </div>
                            <div className="col-12 mt-3">
                                <p className="text-center">To finalize a channel allowing you to withdraw your DBETs,
                                    click on the 'Close
                                    Channel' button below</p>
                            </div>
                            <div className="col-12">
                                <MuiThemeProvider muiTheme={themes.getButtons()}>
                                    <FlatButton
                                        label="Close Channel"
                                        disabled={self.state.finalized}
                                        className="mx-auto d-block"
                                        onClick={() => {
                                            slotsChannelHandler.finalizeChannel(self.state, (err, data) => {
                                                helper.toggleSnackbar(err ?
                                                    'Error sending finalize channel transaction' :
                                                    'Successfully sent finalize channel transaction')
                                                console.log('Finalize channel callback', err, data)
                                            })
                                        }}
                                    />
                                </MuiThemeProvider>
                            </div>
                            <div className="col-12 mt-3">
                                <p className="text-center">After finalizing your channel and a time period of 1 minute,
                                    please click on the Claim DBETs button below to claim your DBETs from the
                                    channel</p>
                            </div>
                            <div className="col-12">
                                <MuiThemeProvider muiTheme={themes.getButtons()}>
                                    <FlatButton
                                        label="Claim DBETs"
                                        disabled={!self.state.closed || self.state.claimed[false]}
                                        className="mx-auto d-block"
                                        onClick={() => {
                                            slotsChannelHandler.claimDbets(self.state, (err, data) => {
                                                console.log('Claim DBETs callback', err, data)
                                                helper.toggleSnackbar(err ? 'Error sending claim DBETs transaction' :
                                                                            'Successfully sent claim DBETs transaction')
                                            })
                                        }}
                                    />
                                </MuiThemeProvider>
                            </div>
                        </div>
                    </Card>
                </div>
            },
            channelDetails: () => {
                return <div className="col-12 mt-4">
                    <Card style={styles.card} className="p-4">
                        <section className="channel-details">
                            <h3 className="text-center text-uppercase mb-3">Channel Details</h3>
                            <div className="row mt-4">
                                <div className="col-6">
                                    <h5>Initial Deposit</h5>
                                    <p>{helper.formatEther(self.state.info.initialDeposit.toString())} DBETs</p>
                                </div>
                                <div className="col-6">
                                    <h5>Initial User Number</h5>
                                    <p>{self.state.hashes.initialUserNumber}</p>
                                </div>
                                <div className="col-6">
                                    <h5>Final User Hash</h5>
                                    <p>{self.state.hashes.finalUserHash}</p>
                                </div>
                                <div className="col-6">
                                    <h5>Initial House Seed Hash</h5>
                                    <p>{self.state.hashes.initialHouseSeedHash}</p>
                                </div>
                                <div className="col-6">
                                    <h5>Final Reel Hash</h5>
                                    <p>{self.state.hashes.finalReelHash}</p>
                                </div>
                                <div className="col-6">
                                    <h5>Final Seed Hash</h5>
                                    <p>{self.state.hashes.finalSeedHash}</p>
                                </div>
                            </div>
                        </section>
                    </Card>
                </div>
            },
            spinHistory: () => {
                return <div className="col-12 my-4">
                    <Card style={styles.card} className="p-4">
                        <section>
                            <h3 className="text-center text-uppercase mb-3">Spin History</h3>
                            <table className="table table-striped table-responsive">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User Hash</th>
                                    <th>Reel Hash</th>
                                    <th>Reel Seed Hash</th>
                                    <th>Reel</th>
                                    <th>Payout</th>
                                    <th>Valid?</th>
                                </tr>
                                </thead>
                                <tbody>
                                {   self.helpers().spinsHistory().map((spin) =>
                                    <tr>
                                        <td>{spin.nonce}</td>
                                        <td>{spin.userHash}</td>
                                        <td>{spin.reelHash}</td>
                                        <td>{spin.reelSeedHash}</td>
                                        <td>{JSON.stringify(spin.reel)}</td>
                                        <td>{spin.payout}</td>
                                        <td>{spin.isValid ?
                                            <span className="text-success text-uppercase">Valid</span> :
                                            <span className="text-danger text-uppercase">Invalid</span>}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </section>
                    </Card>
                </div>
            }
        }
    }

    render() {
        const self = this
        return <div className="slots-game container">
            {   self.state.lastSpinLoaded &&
            <div className="row">
                { self.views().game() }
                { self.views().channelOptions() }
                { self.views().channelDetails() }
                { self.views().spinHistory() }
            </div>
            }
        </div>
    }

}

export default Game