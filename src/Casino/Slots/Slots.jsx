import { BigNumber } from 'bignumber.js'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import * as thunks from '../state/thunks'
import { Grid } from '@material-ui/core'
import SlotsList from './SlotsList'
import StateChannelBuilder from './StateChannelBuilder'
import StateChannelTable from './StateChannelTable'
import StateChannelToolbar from './StateChannelToolbar'
import StateChannelWaiter from './StateChannelWaiter'
import TransparentPaper from '../../common/components/TransparentPaper'

import './slots.css'

class Slots extends Component {
    state = {
        stateMachine: 'loading',
        buildStatus: null,
        claimableChannels: [],
        activeChannels: [],
        currentChannel: '0x'
    }

    isChannelClaimed(channel) {
        if (!channel.info) return false
        return (
            channel.info.finalized && channel.deposited.isLessThanOrEqualTo(0)
        )
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({ stateMachine: 'list_games' })
        }, 3000)
        //this.props.dispatch(thunks.initializeSlots())
        //this.refreshChannels()
    }

    refreshChannels = async () => {
        // UI Update
        this.setState({ stateMachine: 'loading' })

        // Get channels and wait
        const result = await this.props.dispatch(thunks.fetchChannels())
        console.log('fetchChannels', result)
        const channels = result.value

        // Make a list of all usable channels for the user and publish it
        const activeChannels = []
        const nonDepositedChannels = []
        const claimableChannels = []

        if (channels) {
            for (const channelId in channels) {
                if (channels.hasOwnProperty(channelId)) {
                    const channel = channels[channelId]

                    // Is channel still usable?
                    const isUsable =
                        channel.info &&
                        channel.info.ready &&
                        channel.info.activated &&
                        !channel.info.finalized
                    if (isUsable) activeChannels.push(channelId)

                    // Channel has not been deposited into yet, continue building channel
                    const isNotReady =
                        channel.info &&
                        !channel.info.ready &&
                        !channel.info.activated &&
                        !channel.info.finalized

                    if (isNotReady) nonDepositedChannels.push(channelId)

                    if (
                        channel.info.finalized &&
                        !this.isChannelClaimed(channel)
                    )
                        claimableChannels.push(channelId)
                }
            }
        }

        this.setState({ activeChannels, claimableChannels })
        console.log({ activeChannels, claimableChannels, nonDepositedChannels })

        // If there is exactly one usable channel active, switch to it.
        if (activeChannels.length === 1) {
            this.setState({
                stateMachine: 'select_game',
                currentChannel: activeChannels[0]
            })
        } else if (nonDepositedChannels.length >= 1) {
            // Continue building channel
            const channel = nonDepositedChannels[0]
            console.log('Continue building channel', channel)

            // Update UI. Tell the user we are building the channel
            this.setState({ stateMachine: 'building_game' })

            // Create the channel
            const thunk = thunks.depositIntoCreatedChannel(
                channel,
                this.onUpdateBuildStatusListener
            )
            const currentChannel = await this.props.dispatch(thunk)

            // Update UI
            this.setState({ stateMachine: 'select_game', currentChannel })
        } else {
            // Ask the user to either select a channel or create a new one
            this.setState({ stateMachine: 'select_channels' })
        }
    }

    // Builds the entire State Channel in one Step
    onBuildChannelListener = async amount => {
        const allowance = new BigNumber(this.props.allowance)
        const balance = new BigNumber(this.props.balance)
        const parsedAmount = new BigNumber(amount)

        // Update UI. Tell the user we are building the channel
        this.setState({ stateMachine: 'building_game' })

        // Create the channel
        const thunk = thunks.buildChannel(
            parsedAmount,
            allowance,
            balance,
            this.onUpdateBuildStatusListener
        )
        const currentChannel = await this.props.dispatch(thunk)

        // Update UI
        this.setState({ stateMachine: 'select_game', currentChannel })
    }

    onUpdateBuildStatusListener = buildStatus => {
        console.log('onUpdateBuildStatusListener', buildStatus)
        this.setState({ buildStatus })
    }

    // Claims the tokens from a Channel
    onClaimChannelListener = async channelId => {
        this.setState({ stateMachine: 'claiming' })
        await this.props.dispatch(thunks.claimAndWithdrawFromChannel(channelId))
        // Refresh UI
        await this.refreshChannels()
    }

    onGoToGameroomListener = gameName => {
        const path = `/slots/${this.state.currentChannel}/${gameName}`
        this.props.history.push(path)
    }

    /**
     * Renders the buttons for each State Channel Row in the Table
     */
    renderStateChannelToolbar = channel => (
        <StateChannelToolbar
            channel={channel}
            onClaimChannelListener={this.onClaimChannelListener}
        />
    )

    renderLoadingState = message => (
        <StateChannelWaiter
            message={message ? message : this.state.buildStatus}
        />
    )

    renderSelectChannelsState = () => (
        <Fragment>
            {this.renderChannelTable()}
            <StateChannelBuilder
                onBuildChannelListener={this.onBuildChannelListener}
            />
        </Fragment>
    )

    channelBalanceParser(channel) {
        let initialDeposit =
            channel && channel.info
                ? new BigNumber(channel.info.initialDeposit)
                : 0
        let totalTokens = new BigNumber(initialDeposit)
        if (channel && channel.houseSpins && channel.houseSpins.length > 0) {
            const lastIdx = channel.houseSpins.length - 1
            const rawBalance = channel.houseSpins[lastIdx].userBalance
            totalTokens = new BigNumber(rawBalance)
        }
        return totalTokens.dividedBy(units.ether).toFixed(0)
    }

    renderSelectGameState = allowSelect => {
        let balance
        if (allowSelect) {
            const channel = this.props.channels[this.state.currentChannel]
            const balance = this.channelBalanceParser(channel)
        } else {
            balance = 0
        }

        return (
            <React.Fragment>
                {this.renderChannelTable()}
                <SlotsList
                    balance={balance}
                    allowSelect={allowSelect}
                    onGameSelectedListener={this.onGoToGameroomListener}
                />
            </React.Fragment>
        )
    }

    renderChannelTable = () => (
        <StateChannelTable
            channelMap={this.props.channels}
            activeChannels={this.state.activeChannels}
            claimableChannels={this.state.claimableChannels}
            /* Function as a child. Receives `channel` */
            channelProp={this.renderStateChannelToolbar}
        />
    )

    renderStateMachine = () => {
        switch (this.state.stateMachine) {
            case 'loading':
                return this.renderLoadingState()
            case 'select_channels':
                return this.renderSelectChannelsState()
            case 'building_game':
                return this.renderLoadingState()
            case 'list_games':
                return this.renderSelectGameState(false)
            case 'select_game':
                return this.renderSelectGameState(true)
            case 'claiming':
                return this.renderLoadingState('Claiming DBETs..')
            default:
                return this.renderLoadingState()
        }
    }

    render() {
        return (
            <Grid
                container={true}
                direction="column"
                spacing={24}
                justify="center"
                alignItems="center"
            >
                <Grid item={true} xs={12} style={{ maxWidth: 1250 }}>
                    <TransparentPaper>
                        {this.renderStateMachine()}
                    </TransparentPaper>
                </Grid>
            </Grid>
        )
    }
}

export default connect(state => state.casino)(Slots)
