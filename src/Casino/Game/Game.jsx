import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Typography,
    Grid
} from '@material-ui/core'
import ethUnits from 'ethereum-units'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import * as Thunks from '../state/thunks'
import { CHANNEL_STATUS_FINALIZED, MIN_VTHO_AMOUNT } from '../../constants'
import ChannelDetail from './ChannelDetail'
import Iframe from './Iframe'
import BigNumber from 'bignumber.js'
import AppLoading from '../../common/components/AppLoading'
import './game.css'
import { VIEW_SLOTS } from 'src/routes'
import ConfirmationDialog from '../../common/components/ConfirmationDialog'

class Game extends Component {
    constructor(props) {
        super(props)
        this.formatEther = this.formatEther.bind(this)
        this.renderGame = this.renderGame.bind(this)
    }
    state = {
        dialogIsOpen: false,
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
            balances: this.getBalance,
            vthoBalance: this.props.vthoBalance,
            minVthoAmount: MIN_VTHO_AMOUNT,
            onSpinWithoutMinBalance: this.onSpinWithoutMinBalance
        }
    }

    componentWillUnmount = () => {
        this.unsubscribeFromActiveSubscriptions()
    }

    formatEther(ether): string {
        const units = ethUnits.units.ether

        return new BigNumber(ether).dividedBy(units).toFixed(2)
    }

    initSubscriptions = () => {
        this.subscribeToSpinResponses()
        this.subscribeToFinalizeResponses()
    }

    unsubscribeFromActiveSubscriptions = () => {
        const { dispatch } = this.props
        dispatch(Thunks.unsubscribeFromActiveSubscriptions())
    }

    subscribeToSpinResponses = () => {
        const { dispatch, channelId } = this.props

        const onSpinResponseListener = (
            err,
            msg,
            houseSpin,
            userSpin,
            lines
        ) => {
            if (!err) {
                console.log('onSpinResponseListener', this.props.houseSpins)
                let isValidHouseSpin = dispatch(
                    Thunks.verifyHouseSpin(
                        this.props,
                        houseSpin,
                        userSpin,
                        lines
                    )
                )
                if (isValidHouseSpin) listener(err, msg, lines)
            }
        }

        const listener = (err, msg, lines) => {
            if (!err) {
                let originalBalances = this.getBalance()
                dispatch(Thunks.spinAndIncreaseNonce(channelId, msg))
                let updatedBalances = this.getBalance()
                if (window.slotsController.onSpinEvent)
                    window.slotsController.onSpinEvent(
                        lines,
                        originalBalances,
                        updatedBalances
                    )
                if (this.state.spinCallback) {
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
            user: this.formatEther(this.props.userBalance),
            house: this.formatEther(this.props.houseBalance)
        }
    }

    onSpinWithoutMinBalance = () => {
        this.setState({ dialogIsOpen: true })
    }

    onCloseDialog = () => {
        this.setState({ dialogIsOpen: false })
    }

    onFinalizeListener = async () => {
        this.setState({ isFinalizing: true })
        await this.props.dispatch(
            Thunks.finalizeChannel(this.props.channelId, this.props)
        )
    }

    subscribeToFinalizeResponses = () => {
        const { dispatch } = this.props

        const onFinalizeResponseListener = (err, msg) => {
            if (!err) {
                this.back()
            }
        }

        dispatch(
            Thunks.subscribeToFinalizeResponses(onFinalizeResponseListener)
        )
    }

    /**
     * Go to the previous page
     */
    back = () => this.props.history.push(VIEW_SLOTS)

    renderGame() {
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
                            {this.formatEther(this.props.userBalance)}
                        </Typography>
                    </CardContent>
                </Card>
            )
        } else if (this.props.lastSpinLoaded) {
            const game = this.props.match.params.gameName || 'game'
            const path = `${process.env.PUBLIC_URL}/slots-${game}/game`
            return (
                <React.Fragment>
                    <ConfirmationDialog
                        title="Minimum VTHO balance"
                        content="VTHO balance is too low to complete the transaction. Please ensure you have over 7500 VTHO to complete the transaction."
                        open={this.state.dialogIsOpen}
                        onClickOk={this.onCloseDialog}
                        onClose={this.onCloseDialog}
                    />
                    <Iframe
                        className="full-size"
                        id="slots-iframe"
                        url={path}
                        width="100%"
                        height="100%"
                        position="relative"
                        allowFullScreen={true}
                    />
                </React.Fragment>
            )
        } else {
            return <AppLoading message="Loading the game..." />
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
        <Grid
            container={true}
            direction="row"
            justify="space-between"
            spacing={40}
        >
            <Grid item={true}>
                <Button variant="raised" color="primary" onClick={this.back}>
                    Lobby
                </Button>
            </Grid>
            <Grid item={true}>
                <Button
                    variant="raised"
                    color="primary"
                    onClick={this.onFinalizeListener}
                >
                    Exit Slots
                </Button>
            </Grid>
        </Grid>
    )

    renderInner = () => {
        if (this.state.isFinalizing) {
            // If finalizing, print simple placeholder
            return <AppLoading message="Exiting..." />
        } else {
            // Show normal page
            return (
                <Fragment>
                    {this.renderHeader()}
                    <Grid
                        container={true}
                        direction="row"
                        justify="center"
                        spacing={40}
                    >
                        <Grid
                            item={true}
                            xs={12}
                            style={{ height: 600, maxWidth: 1300 }}
                        >
                            {this.renderGame()}
                        </Grid>
                        <Grid item={true} xs={12}>
                            {this.renderChannelDetail()}
                        </Grid>
                    </Grid>
                </Fragment>
            )
        }
    }

    render() {
        return this.renderInner()
    }
}

export default connect((state, props) => {
    // This component's props is the data of a single State Channel,
    // whose ID is defined in `props.match.params.id`
    let channelId = props.match.params.id
    let channelData = state.casino.channels[channelId]
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

    channelData.vthoBalance = state.casino.vthoBalance.toFixed(5)

    return channelData
})(Game)
