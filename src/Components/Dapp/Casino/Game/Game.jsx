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
        isFinalizing: false,
        spinCallback: null
    }

    componentDidMount = () => {
        const { dispatch, channelId } = this.props
        dispatch(Thunks.initializeGame(channelId))
        this.initSubscriptions()

        // TODO: Make this less ugly
        // Maybe we should use websockets to communicate instead?
        window.slotsController = {
            spin: this.spin,
            balances: this.getBalance
        }
    }

    initSubscriptions = () => {
        this.subscribeToSpinResponses()
        this.subscribeToFinalizeResponses()
    }

    subscribeToSpinResponses = () => {
        const { dispatch, channelId } = this.props

        const onSpinResponseListener = (err, msg, houseSpin, userSpin, lines) => {
            if(!err) {
                let isValidHouseSpin =
                    dispatch(Thunks.verifyHouseSpin(this.props, houseSpin, userSpin, lines))
                if(isValidHouseSpin)
                    listener(err, msg, lines)
            }
        }

        const listener = (err, msg, lines) => {
            if (!err) {
                let originalBalances = this.getBalance()
                dispatch(Thunks.spinAndIncreaseNonce(channelId, msg))
                let updatedBalances = this.getBalance()
                if(window.slotsController.onSpinEvent)
                    window.slotsController.onSpinEvent(lines, originalBalances, updatedBalances)
                if(this.state.spinCallback) {
                    this.state.spinCallback(err, msg, lines, updatedBalances)
                    this.setState({ spinCallback: null })
                }
            }
        }

        dispatch(Thunks.subscribeToSpinResponses(onSpinResponseListener))
    }

    spin = (lines, betSize, callback) => {
        const { dispatch } = this.props
        const totalBetSize = lines * betSize

        dispatch(Thunks.spin(totalBetSize, this.props))
        this.setState({ spinCallback: callback })
    }

    getBalance = () => {
        return {
            user: helper.formatEther(this.props.userBalance),
            house: helper.formatEther(this.props.houseBalance)
        }
    }

    onFinalizeListener = async () => {
        this.setState({ isFinalizing: true })
        await this.props.dispatch(Thunks.finalizeChannel(this.props.channelId, this.props))
    }

    subscribeToFinalizeResponses = () => {
        const { dispatch } = this.props

        const onFinalizeResponseListener = (err, msg) => {
            if(!err) {
                this.setState({ isFinalizing: false })
                this.back()
            }
        }

        dispatch(Thunks.subscribeToFinalizeResponses(onFinalizeResponseListener))
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
                Lobby
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
