import { BigNumber } from 'bignumber.js'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Actions, Thunks } from '../../../../Model/slotsManager'
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
                if (channel.info.finalized && !channel.info.claimed) {
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

    // Selects An Existing Channel
    onSelectChannelListener = currentChannel =>
        this.setState({ stateMachine: 'select_game', currentChannel })

    // Claims the tokens from a Channel
    onClaimChannelListener = async channelId => {
        await this.props.dispatch(Thunks.claimAndWithdrawFromChannel(channelId))

        // Refresh UI
        this.refreshChannels()
    }

    onGoToGameroomListener = () =>
        this.props.history.push(`/slots/${this.state.currentChannel}`)

    /**
     * Renders the buttons for each State Channel Row in the Table
     */
    renderStateChannelToolbar = channel => (
        <StateChannelToolbar
            channel={channel}
            onSelectChannelListener={this.onSelectChannelListener}
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
            <StateChannelTable
                channelMap={this.props.channels}
                activeChannels={this.state.activeChannels}
                claimableChannels={this.state.claimableChannels}
            >
                {/* Function as a child. Receives `channel` */}
                {this.renderStateChannelToolbar}
            </StateChannelTable>
            <StateChannelBuilder
                onBuildChannelListener={this.onBuildChannelListener}
            />
        </Fragment>
    )

    renderSelectGame = () => {
        const stateChannel = this.props.channels[this.state.currentChannel]
        return (
            <SlotsList
                stateChannel={stateChannel}
                onGameSelectedListener={this.onGoToGameroomListener}
            />
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
                return this.renderSelectGame()

            default:
                return null
        }
    }

    render() {
        return (
            <main className="slots container">{this.renderStateMachine()}</main>
        )
    }
}

export default connect(reduxState => reduxState.slotsManager)(Slots)
