import React, { Component } from 'react'
import { Card } from 'material-ui'
import Bluebird from 'bluebird'
import { connect } from 'react-redux'
import Helper from '../../../Helper'
import Iframe from '../../../Base/Iframe'
import ChannelOptions from './ChannelOptions'
import ChannelDetail from './ChannelDetail'
import SpinHistory from './SpinHistory'
import {
    Actions,
    SlotsChannelHandler,
    watcherChannelClaimed,
    watcherChannelFinalized
} from '../../../../Model/slotsManager'
import { CHANNEL_STATUS_FINALIZED } from '../../../Constants'
import { styles as Styles } from '../../../Base/styles'

import './game.css'

const styles = Styles()
const helper = new Helper()
const slotsChannelHandler = new SlotsChannelHandler()

class Game extends Component {
    componentWillMount = () => {
        let { dispatch, channelId } = this.props
        dispatch(Actions.getAesKey(channelId))
        dispatch(Actions.getChannelDetails(channelId))
        dispatch(Actions.getLastSpin(channelId))

        watcherChannelClaimed(channelId, dispatch)
        watcherChannelFinalized(channelId, dispatch)

        // TODO: Make this less ugly
        // Maybe we should use websockets to communicate instead?
        let controller = {
            spin: this.spin,
            balances: this.getBalance
        }
        window.slotsController = () => controller
    }

    spin = (betSize, callback) => {
        let { dispatch, channelId } = this.props
        slotsChannelHandler.spin(betSize, this.props, (err, msg, lines) => {
            if (!err) {
                // Spin the slots, wait for the action to complete,
                // AND THEN increase the nonce.
                dispatch(async dispatch2 => {
                    await dispatch2(Actions.postSpin(channelId, msg))
                    await dispatch2(Actions.nonceIncrease(channelId))
                })
            }
            callback(err, msg, lines)
        })
    }

    getBalance = () => {
        let penultimate = this.props.houseSpins.length - 1
        let lastHouseSpin = this.props.houseSpins[penultimate]
        let nonce = this.props.nonce
        let userBalance =
            nonce === 1
                ? this.props.info.initialDeposit
                : lastHouseSpin.userBalance
        let houseBalance =
            nonce === 1
                ? this.props.info.initialDeposit
                : lastHouseSpin.houseBalance
        return {
            user: helper.formatEther(userBalance),
            house: helper.formatEther(houseBalance)
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
        const isFinalized = this.props.status === CHANNEL_STATUS_FINALIZED
        if (isFinalized && this.props.houseSpins) {
            return (
                <Card style={styles.card} className="p-4">
                    <h3 className="text-center">
                        The channel has been finalized. Please wait a minute
                        before the channel closes and claiming your DBETs.
                    </h3>
                    <p className="lead text-center mt-2">
                        Final Balance: {this.getBalance().user}
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

    renderChannelDetail = () => {
        if (this.props.info) {
            return (
                <ChannelDetail
                    initialDeposit={this.props.info.initialDeposit}
                    hashes={this.props.hashes}
                />
            )
        }
    }

    renderSpinHistory = () => {
        if (this.props.houseSpins) {
            let { userHashes, houseSpins } = this.props
            let spinArray = houseSpins.map(spin => {
                let payout = slotsChannelHandler
                    .helpers()
                    .calculateReelPayout(spin.reel, helper.convertToEther(5))
                return {
                    ...spin,
                    userHash: userHashes[userHashes.length - spin.nonce],
                    payout,
                    isValid: true
                }
            })
            return <SpinHistory spinArray={spinArray} />
        }
    }

    render() {
        const isClaimed = this.props.claimed ? this.props.claimed[true] : false
        const isFinalized = this.props.status === CHANNEL_STATUS_FINALIZED
        return (
            <main className="slots-game container">
                <div className="row">
                    <div className="col-12 mx-auto">{this.renderGame()}</div>

                    <div className="col-12 mt-4">
                        <ChannelOptions
                            isClosed={this.props.closed}
                            isClaimed={isClaimed}
                            isFinalized={isFinalized}
                            onClaimListener={this.onClaimListener}
                            onFinalizeListener={this.onFinalizeListener}
                        />
                    </div>

                    <div className="col-12 mt-4">
                        {this.renderChannelDetail()}
                    </div>

                    <div className="col-12 my-4">
                        {this.renderSpinHistory()}
                    </div>
                </div>
            </main>
        )
    }
}

export default connect((state, props) => {
    // This component's props is the data of a single State Channel,
    // whose ID is defined in `props.match.params.id`
    let channelId = props.match.params.id
    let channelData = state.slotsManager.channels[channelId]
    if (!channelData) {
        channelData = {}
    }
    channelData.channelId = props.match.params.id
    return channelData
})(Game)
