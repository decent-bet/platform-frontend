import { BigNumber } from 'bignumber.js'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Actions, Thunks } from '../../../../Model/slotsManager'
import { isChannelClaimed } from '../functions'
import SlotsList from './SlotsList'
import StateChannelBuilder from './StateChannelBuilder'
import StateChannelTable from './StateChannelTable'
import StateChannelToolbar from './StateChannelToolbar'
import StateChannelWaiter from './StateChannelWaiter'

import './slots.css'

class Slots extends Component {
    state = {
        stateMachine: 'loading',
        claimableChannels: [],
        activeChannels: [],
        currentChannel: '0x'
    }

    componentDidMount = () => {
        this.props.dispatch(Actions.getSessionId())
        this.props.dispatch(Actions.getBalance())
        this.props.dispatch(Actions.getAllowance())

        this.refreshChannels()
    }

    refreshChannels = async () => {
        // UI Update
        this.setState({ stateMachine: 'loading' })

        // Get channels and wait
        const result = await this.props.dispatch(Actions.getChannels())
        const channels = result.value

        // Make a list of all usable channels for the user and publish it
        const activeChannels = []
        const claimableChannels = []
        for (const channelId in channels) {
            if (channels.hasOwnProperty(channelId)) {
                const channel = channels[channelId]

                // Is channel still usable?
                const isUsable =
                    channel.info.ready &&
                    channel.info.activated &&
                    !channel.info.finalized
                if (isUsable) {
                    activeChannels.push(channelId)
                }
                if (channel.info.finalized && !isChannelClaimed(channel)) {
                    claimableChannels.push(channelId)
                }
            }
        }
        this.setState({ activeChannels, claimableChannels })

        // If there is exactly one usable channel active, switch to it.
        if (activeChannels.length === 1) {
            this.setState({
                stateMachine: 'select_game',
                currentChannel: activeChannels[0]
            })
        } else {
            // Ask the user to either select a channel or create a new one
            this.setState({ stateMachine: 'select_channels' })
        }
    }

    // Builds the entire State Channel in one Step
    onBuildChannelListener = async amount => {
        const allowance = new BigNumber(this.props.allowance)
        const parsedAmount = new BigNumber(amount)

        // Update UI. Tell the user we are building the channel
        this.setState({ stateMachine: 'building_game' })

        // Create the channel
        const thunk = Thunks.buildChannel(parsedAmount, allowance)
        const currentChannel = await this.props.dispatch(thunk)

        // Update UI
        this.setState({ stateMachine: 'select_game', currentChannel })
    }

    // Claims the tokens from a Channel
    onClaimChannelListener = async channelId => {
        this.setState({ stateMachine: 'claiming' })
        await this.props.dispatch(Thunks.claimAndWithdrawFromChannel(channelId))

        // Refresh UI
        this.refreshChannels()
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
            builtChannelId={this.props.builtChannelId}
            message={message}
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

    renderSelectGameState = () => {
        const stateChannel = this.props.channels[this.state.currentChannel]
        return (
            <Fragment>
                {this.renderChannelTable()}
                <SlotsList
                    stateChannel={stateChannel}
                    onGameSelectedListener={this.onGoToGameroomListener}
                />
            </Fragment>
        )
    }

    renderChannelTable = () => {
        return (
            <StateChannelTable
                channelMap={this.props.channels}
                activeChannels={this.state.activeChannels}
                claimableChannels={this.state.claimableChannels}
            >
                {/* Function as a child. Receives `channel` */}
                {this.renderStateChannelToolbar}
            </StateChannelTable>
        )
    }

    renderStateMachine = () => {
        switch (this.state.stateMachine) {
            case 'loading':
                return this.renderLoadingState('Loading your State Channels')

            case 'select_channels':
                return this.renderSelectChannelsState()

            case 'building_game':
                return this.renderLoadingState('Building your state channel')

            case 'select_game':
                return this.renderSelectGameState()

            case 'claiming':
                return this.renderLoadingState('Claiming Channel Tokens')

            default:
                return null
        }
    }

    render() {
        return (
            <main className="slots container">
                {this.renderStateMachine()}
            </main>
        )
    }
}

export default connect(reduxState => reduxState.slotsManager)(Slots)
