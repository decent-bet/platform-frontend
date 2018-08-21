import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Typography
} from '@material-ui/core'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import {
    Thunks
} from '../../../../Model/slotsManager'
import { CHANNEL_STATUS_FINALIZED } from '../../../Constants'
import Helper from '../../../Helper'
import ChannelDetail from './ChannelDetail'
import Iframe from './Iframe'

import './game.css'

const helper = new Helper()

class Game extends Component {
    state = {
        isFinalizing: false
    }

    componentDidMount = () => {
        const { dispatch, channelId } = this.props
        dispatch(Thunks.initializeGame(channelId))

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
            let _lines = lines.splice(0, 3)
            let _temp = lines[0]
            _lines[0] = lines[1]
            _lines[1] = _temp
            callback(err, msg, _lines)
        }

        dispatch(Thunks.spin(totalBetSize, this.props, listener))

    }

    getBalance = () => ({
        user: helper.formatEther(this.props.userBalance),
        house: helper.formatEther(this.props.houseBalance)
    })

    onFinalizeListener = async () => {
        this.setState({ isFinalizing: true })
        const thunk = Thunks.finalizeChannel(this.props.channelId, this.props)
        await this.props.dispatch(thunk)
        this.setState({ isFinalizing: false })
        this.back()
    }

    /**
     * Go to the previous page
     */
    back = () => this.props.history.push(`/slots/`)

    renderGame = () => {
        if (this.props.status === CHANNEL_STATUS_FINALIZED) {
            return (
                <Card className="card full-size">
                    <CardHeader title="The channel has been finalized" />
                    <CardContent>
                        <Typography>
                            Please wait a minute before claiming your DBETs.
                        </Typography>
                        <Typography>
                            Final Balance:{' '}
                            {helper.formatEther(this.props.userBalance)}
                        </Typography>
                    </CardContent>
                </Card>
            )
        } else if (this.props.lastSpinLoaded) {
            const game = this.props.match.params.gameName || 'game'
            const path = `${process.env.PUBLIC_URL}/slots-${game}/game`
            return (
                <Iframe
                    className="full-size"
                    id="slots-iframe"
                    url={path}
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
                    houseSpins={this.props.houseSpins}
                    userHashes={this.props.userHashes}
                />
            )
        }
    }

    renderHeader = () => (
        <section className="controls">
            <Button variant="raised" color="primary" onClick={this.back}>
                Switch Game
            </Button>
            <Button
                variant="raised"
                color="primary"
                onClick={this.onFinalizeListener}
            >
                Exit Slots
            </Button>
        </section>
    )

    renderInner = () => {
        if (this.state.isFinalizing) {
            // If finalizing, print simple placeholder
            return (
                <Card className="card">
                    <CardHeader title="Exiting" />
                </Card>
            )
        } else {
            // Show normal page
            return (
                <Fragment>
                    {this.renderHeader()}
                    {this.renderGame()}
                    {this.renderChannelDetail()}
                </Fragment>
            )
        }
    }

    render() {
        return (
            <main className="slots-game container">{this.renderInner()}</main>
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
