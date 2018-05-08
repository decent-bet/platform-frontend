import { BigNumber } from 'bignumber.js'
import { RaisedButton } from 'material-ui'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import {
    Actions,
    initWatchers,
    stopWatchers
} from '../../../../Model/slotsManager'
import SlotsList from './SlotsList'
import StateChannelBuilder from './StateChannelBuilder'
import StateChannelTable from './StateChannelTable'
import StateChannelWaiter from './StateChannelWaiter'

import './slots.css'

/**
 * The "Use" buttons are stateful. They must rememeber their channelId for it to work
 */
class GoToChannelButton extends Component {
    onGoToChannelListener = () => {
        this.props.onClick(this.props.channelId)
    }

    render() {
        const { onClick, channelId, isEnabled, ...rest } = this.props
        return (
            <RaisedButton
                {...rest}
                onClick={this.onGoToChannelListener}
                disabled={!isEnabled}
            />
        )
    }
}

/**
 * The "Claim" buttons are stateful. They must rememeber their channelId for it to work
 */
class ClaimChannelButton extends Component {
    onClaimChannelListener = () => this.props.onClick(this.props.channelId)

    render() {
        const { onClick, channelId, isEnabled, ...rest } = this.props
        return (
            <RaisedButton
                {...rest}
                onClick={this.onClaimChannelListener}
                disabled={!isEnabled}
            />
        )
    }
}

class Slots extends Component {
    state = {
        stateMachine: 'loading',
        currentChannel: '0x'
    }

    componentDidMount = () => {
        this.props.dispatch(Actions.getSessionId())
        this.props.dispatch(Actions.getBalance())
        this.props.dispatch(Actions.getAllowance())

        // Get channels, and when returned, set the State Machine
        // to the next step
        this.props.dispatch(async dispatch2 => {
            await dispatch2(Actions.getChannels())
            this.setState({ stateMachine: 'select_channels' })
        })

        // Init Watchers
        this.props.dispatch(initWatchers)
    }

    componentWillUnmount = () => {
        // Stop watchers
        this.props.dispatch(stopWatchers)
    }

    // Builds the entire State Channel in one Step
    onBuildChannelListener = amount => {
        const allowance = new BigNumber(this.props.allowance)
        const parsedAmount = new BigNumber(amount)

        // UI Update. Tell the user we are building the channel
        this.setState({ stateMachine: 'building_game' })

        // Start creating the channel, and update the state afterwards
        this.props.dispatch(async dispatch2 => {
            const action = Actions.buildChannel(parsedAmount, allowance)
            const currentChannel = await dispatch2(action)
            this.setState({ stateMachine: 'select_game', currentChannel })
        })
    }

    // Selects An Existing Channel
    onSelectChannelListener = channelId => {
        this.setState({
            stateMachine: 'select_game',
            currentChannel: channelId
        })
    }

    // Claims the tokens from a Channel
    onClaimChannelListener = channelId =>
        this.props.dispatch(Actions.claimAndWithdrawFromChannel(channelId))

    onGoToGameroomListener = () =>
        this.props.history.push(`/slots/${this.state.currentChannel}`)

    /**
     * Renders the buttons for each State Channel Row in the Table
     */
    renderStateChannelToolbar = channel => (
        <Fragment>
            <GoToChannelButton
                channelId={channel.channelId}
                label="Use"
                primary={true}
                onClick={this.onSelectChannelListener}
                isEnabled={!channel.info.finalized}
            />
            <ClaimChannelButton
                channelId={channel.channelId}
                label="Claim Tokens"
                primary={true}
                onClick={this.onClaimChannelListener}
                isEnabled={channel.info.finalized}
            />
        </Fragment>
    )

    renderLoadingState = message => (
        <StateChannelWaiter
            builtChannelId={this.props.builtChannelId}
            message={message}
        />
    )

    renderSelectChannelsState = () => (
        <Fragment>
            <StateChannelTable channelMap={this.props.channels}>
                {
                    // Function as a child. Receives `channel`
                    this.renderStateChannelToolbar
                }
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
