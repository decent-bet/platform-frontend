import React, { Component, Fragment } from 'react'
import SlotsList from './SlotsList'
import StateChannelBuilder from './StateChannelBuilder'
import StateChannelWaiter from './StateChannelWaiter'
import StateChannelTable from './StateChannelTable'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import {
    Actions,
    initWatchers,
    stopWatchers
} from '../../../../Model/slotsManager'

import './slots.css'

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

    onGoToGameroomListener = () =>
        this.props.history.push(`/slots/${this.state.currentChannel}`)

    renderLoadingState = () => (
        <StateChannelWaiter builtChannelId={this.props.builtChannelId} />
    )

    renderSelectChannelsState = () => (
        <Fragment>
            <StateChannelTable
                channelMap={this.props.channels}
                onSelectChannelListener={this.onSelectChannelListener}
            />
            <StateChannelBuilder
                onBuildChannelListener={this.onBuildChannelListener}
            />
        </Fragment>
    )

    renderSelectGame = () => (
        <SlotsList
            builtChannelId={this.state.currentChannel}
            onGameSelectedListener={this.onGoToGameroomListener}
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
