import { SHA256 } from 'crypto-js'
import { Card, CardHeader, CardText, RaisedButton } from 'material-ui'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Actions,
    SlotsChannelHandler,
    Thunks,
    watcherChannelClaimed,
    watcherChannelFinalized
} from '../../../../Model/slotsManager'
import { CHANNEL_STATUS_FINALIZED } from '../../../Constants'
import Helper from '../../../Helper'
import { isChannelClaimed } from '../functions'
import ChannelDetail from './ChannelDetail'
import ChannelOptions from './ChannelOptions'
import Iframe from './Iframe'
import SpinHistory from './SpinHistory'

import './game.css'

const helper = new Helper()
const slotsChannelHandler = new SlotsChannelHandler()

class Game extends Component {
    componentDidMount = () => {
        let { dispatch, channelId } = this.props
        dispatch(Actions.getAesKey(channelId))
        dispatch(Actions.getChannelDetails(channelId))
        dispatch(Actions.getLastSpin(channelId))

        watcherChannelClaimed(channelId, dispatch)
        watcherChannelFinalized(channelId, dispatch)

        // TODO: Make this less ugly
        // Maybe we should use websockets to communicate instead?
        window.slotsController = () => ({
            spin: this.spin,
            balances: this.getBalance
        })
    }

    spin = (lines, betSize, callback) => {
        const { dispatch, channelId } = this.props
        const totalBetSize = lines * betSize
        const listener = (err, msg, lines) => {
            if (!err) {
                dispatch(Thunks.spinAndIncreaseNonce(channelId, msg))
            }
            callback(err, msg, lines)
        }

        slotsChannelHandler.spin(totalBetSize, this.props, listener)
    }

    getBalance = () => ({
        user: helper.formatEther(this.props.userBalance),
        house: helper.formatEther(this.props.houseBalance)
    })

    onFinalizeListener = async () => {
        let action = Actions.finalizeChannel(this.props.channelId, this.props)
        await this.props.dispatch(action)
        this.back()
    }

    onClaimListener = async () => {
        const thunk = Thunks.claimAndWithdrawFromChannel(this.props.channelId)
        await this.props.dispatch(thunk)
        this.back()
    }

    /**
     * Go to the previous page
     */
    back = () => this.props.history.push(`/slots/`)

    renderGame = () => {
        if (this.props.isFinalized && this.props.houseSpins) {
            return (
                <Card className="card full-size">
                    <CardHeader title="The channel has been finalized" />
                    <CardText>
                        <p>
                            Please wait a minute before the channel closes and
                            claiming your DBETs.
                        </p>
                        <p>
                            Final Balance:{' '}
                            {helper.formatEther(this.props.userBalance)}
                        </p>
                    </CardText>
                </Card>
            )
        } else if (this.props.lastSpinLoaded) {
            return (
                <Iframe
                    className="full-size"
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
            return (
                <div className="full-size">
                    <h1>Loading</h1>
                </div>
            )
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
                let isValid =
                    spin.reelHash ===
                    SHA256(spin.reelSeedHash + spin.reel.toString()).toString()
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

    renderChannelOptions = () => (
        <ChannelOptions
            isClosed={this.props.closed}
            isClaimed={this.props.isClaimed}
            isFinalized={this.props.isFinalized}
            onClaimListener={this.onClaimListener}
            onFinalizeListener={this.onFinalizeListener}
        />
    )

    renderHeader = () => (
        <section className="full-size controls">
            <RaisedButton
                label="Change Game"
                primary={true}
                onClick={this.back}
            />
            <RaisedButton
                label="Finalize Channel"
                primary={true}
                onClick={this.onFinalizeListener}
            />
        </section>
    )

    render() {
        return (
            <main className="slots-game container">
                {this.renderHeader()}
                {this.renderGame()}
                {this.renderChannelOptions()}
                {this.renderChannelDetail()}
                {this.renderSpinHistory()}
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
    channelData.isClaimed = isChannelClaimed(channelData)
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
