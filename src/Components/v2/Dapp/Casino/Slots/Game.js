/**
 * Created by user on 10/5/2017.
 */

import React, {Component} from 'react'

import {Card, FlatButton} from 'material-ui'

const queryString = require('query-string')

import Helper from '../../../Helper'
import Iframe from '../../../Base/Iframe'
import SlotsChannelHandler from './Libraries/SlotsChannelHandler'

const async = require('async')
const constants = require('../../../Constants')
const styles = require('../../../Base/styles')

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
            lastSpinLoaded: false
        }
    }

    componentWillMount() {
        this.initChannel()
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
                    <Iframe
                        id="slots-iframe"
                        url={ process.env.PUBLIC_URL + '/slots-game' }
                        width="100%"
                        height="600px"
                        display="initial"
                        position="relative"
                        allowFullScreen/>
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
                                <p className="text-center">To end a channel and withdraw your DBETs, click on the 'Close
                                    Channel' button below</p>
                            </div>
                            <div className="col-12">
                                <FlatButton
                                    label="Close Channel"
                                    className="mx-auto d-block"
                                    labelStyle={{
                                        color: constants.COLOR_GOLD
                                    }}
                                />
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