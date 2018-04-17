import React, { Component } from 'react'
import { Card } from 'material-ui'
import Bluebird from 'bluebird'
import { connect } from 'react-redux'
import Helper from '../../../Helper'
import Iframe from '../../../Base/Iframe'
import ChannelOptions from './ChannelOptions'
import ChannelDetail from './ChannelDetail'
import SpinHistory from './SpinHistory'
import { Actions, SlotsChannelHandler } from '../../../../Model/slotsManager'

import './game.css'

const styles = require('../../../Base/styles').styles()

const helper = new Helper()
const slotsChannelHandler = new SlotsChannelHandler()

class Game extends Component {
    componentWillMount = () => {
        let channelId = this.props.match.params.id
        let { dispatch } = this.props
        dispatch(Actions.getAesKey(channelId))
        dispatch(Actions.getChannelDetails(channelId))
        dispatch(Actions.getLastSpin(channelId))

        // TODO: Make this less ugly
        // Maybe we should use websockets to communicate instead?
        let self = this
        window.slotsController = () => {
            return {
                spin: (betSize, callback) => {
                    let tempProps = self.props
                    tempProps = {
                        ...tempProps,
                        id: channelId
                    }
                    slotsChannelHandler.spin(
                        betSize,
                        tempProps,
                        (err, msg, lines) => {
                            if (!err) {
                                // Spin the Slots, AND THEN increase the nonce 
                                dispatch(async dispatch2 => {
                                    await dispatch(Actions.postSpin(msg))
                                    await dispatch(Actions.nonceIncrease())
                                })
                            }
                            callback(err, msg, lines)
                        }
                    )
                },
                balances: () => {
                    let lastHouseSpin =
                        self.props.houseSpins[self.props.houseSpins.length - 1]
                    let nonce = self.props.nonce
                    let userBalance =
                        nonce === 1
                            ? self.props.info.initialDeposit
                            : lastHouseSpin.userBalance
                    let houseBalance =
                        nonce === 1
                            ? self.props.info.initialDeposit
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
        /*this.watchers().channelFinalized()
        this.watchers().claimChannelTokens()*/
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
                            if (self.state.id === id)
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
                            if (id === self.state.id) {
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
                let houseSpins = self.props.houseSpins
                let history = houseSpins.map(spin => {
                    let nonce = spin.nonce
                    return {
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
                    }
                })
                return history
            },
            getUserHashForNonce: nonce => {
                let userHashes = self.props.userHashes
                return userHashes[userHashes.length - nonce]
            }
        }
    }

    onFinalizeListener = async () => {
        try {
            await Bluebird.fromCallback(cb =>
                slotsChannelHandler.finalizeChannel(this.props, cb)
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
                slotsChannelHandler.claimDbets(this.props, cb)
            )
            helper.toggleSnackbar('Successfully sent claim DBETs transaction')
        } catch (err) {
            console.log('Claim DBETs callback', err)
            helper.toggleSnackbar('Error sending claim DBETs transaction')
        }
    }

    renderGame = () => {
        if (this.props.finalized) {
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
        } else if (this.props.lastSpinLoaded) {
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
        } else {
            return <h1>Loading</h1>
        }
    }

    render() {
        return (
            <main className="slots-game container">
                <div className="row">
                    <div className="col-12 mx-auto">{this.renderGame()}</div>

                    <div className="col-12 mt-4">
                        <ChannelOptions
                            isClosed={this.props.closed}
                            isClaimed={this.props.claimed}
                            isFinalized={this.props.finalized}
                            onClaimListener={this.onClaimListener}
                            onFinalizeListener={this.onFinalizeListener}
                        />
                    </div>

                    <div className="col-12 mt-4">
                        <ChannelDetail
                            initialDeposit={this.props.info.initialDeposit}
                            hashes={this.props.hashes}
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
}

export default connect(state => state.slotsManager.spins)(Game)
