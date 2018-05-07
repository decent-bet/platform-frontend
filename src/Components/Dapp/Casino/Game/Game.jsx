import React, { Component } from 'react'
import { Card } from 'material-ui'
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
import { SHA256 } from 'crypto-js'

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

    spin = (lines, betSize, callback) => {
        console.log('spin', lines, betSize)
        let { dispatch, channelId } = this.props
        let totalBetSize = lines * betSize
        slotsChannelHandler.spin(totalBetSize, this.props, (err, msg, lines) => {
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

    getBalance = () => ({
        user: helper.formatEther(this.props.userBalance),
        house: helper.formatEther(this.props.houseBalance)
    })

    onFinalizeListener = () => {
        let action = Actions.finalizeChannel(this.props.channelId, this.props)
        this.props.dispatch(action)
    }

    onClaimListener = () => {
        let action = Actions.claimChannel(this.props.channelId)
        this.props.dispatch(action)
    }

    renderGame = () => {
        if (this.props.isFinalized && this.props.houseSpins) {
            return (
                <Card style={styles.card} className="p-4">
                    <h3 className="text-center">
                        The channel has been finalized. Please wait a minute
                        before the channel closes and claiming your DBETs.
                    </h3>
                    <p className="lead text-center mt-2">
                        Final Balance:{' '}
                        {helper.formatEther(this.props.userBalance)}
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
                let payout = slotsChannelHandler.calculateReelPayout(
                    spin.reel,
                    helper.convertToEther(5)
                )
                let isValid = spin.reelHash === SHA256(spin.reelSeedHash + spin.reel.toString()).toString()
                return {
                    ...spin,
                    userHash: userHashes[userHashes.length - spin.nonce],
                    payout,
                    isValid: isValid
                }
            })
            return <SpinHistory spinArray={spinArray} />
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
                            isClaimed={this.props.isClaimed}
                            isFinalized={this.props.isFinalized}
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

    // Shortcuts for the Channel State
    channelData.isClaimed = channelData.claimed
        ? channelData.claimed[false]
        : false
    channelData.isFinalized = channelData.status === CHANNEL_STATUS_FINALIZED

    // Get the Balances for the House and the user. Set them as 'initialDeposit' if nothing is found
    if (!channelData.info) {
        // Default Values
        channelData.userBalance = 0
        channelData.houseBalance = 0
    } else {
        // Default values if the `info` is already loaded
        channelData.userBalance = channelData.info.initialDeposit
        channelData.houseBalance = channelData.info.initialDeposit
        if (channelData.houseSpins && channelData.nonce) {
            let lastIdx = channelData.houseSpins.length - 1
            let lastHouseSpin = channelData.houseSpins[lastIdx]
            if (channelData.nonce !== 1) {
                // Real Values if there has been at least a spin
                channelData.userBalance = lastHouseSpin.userBalance
                channelData.houseBalance = lastHouseSpin.houseBalance
            }
        }
    }

    return channelData
})(Game)
