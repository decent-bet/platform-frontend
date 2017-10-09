/**
 * Created by user on 10/5/2017.
 */

import React, {Component} from 'react'

import {Card} from 'material-ui'

const queryString = require('query-string')

import Helper from '../../../Helper'
import Iframe from '../../../Base/Iframe'
import SlotsChannelHandler from './Libraries/SlotsChannelHandler'

const async = require('async')
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
                        payout: slotsChannelHandler.helpers().calculateReelPayout(spin.reel, helper.convertToEther(1)),
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
                { self.views().spinHistory() }
            </div>
            }
        </div>
    }

}

export default Game