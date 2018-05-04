import React, { Component } from 'react'
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
        isLoadingChannels: true
    }
    componentDidMount = () => {
        this.props.dispatch(Actions.getSessionId())
        this.props.dispatch(Actions.getBalance())
        this.props.dispatch(Actions.getAllowance())
        this.props.dispatch(async dispatch2 => {
            await dispatch2(Actions.getChannels())
            this.setState({ isLoadingChannels: false })
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
        const action = Actions.buildChannel(parsedAmount, allowance)
        this.props.dispatch(action)
    }

    onGoToGameroomListener = () =>
        this.props.history.push(`/slots/${this.props.builtChannelId}`)

    render() {
        const isBuilderVisible =
            !this.props.isBuildingChannel &&
            !this.state.isLoadingChannels &&
            !Object.getOwnPropertyNames(this.props.channels).length > 0
        return (
            <main className="slots container">
                <StateChannelTable channelMap={this.props.channels} />
                <StateChannelBuilder
                    onBuildChannelListener={this.onBuildChannelListener}
                    isVisible={isBuilderVisible}
                />

                <StateChannelWaiter
                    isBuildingChannel={this.props.isBuildingChannel}
                    builtChannelId={this.props.builtChannelId}
                />

                <SlotsList
                    builtChannelId={this.props.builtChannelId}
                    onGameSelectedListener={this.onGoToGameroomListener}
                />
            </main>
        )
    }
}

export default connect(reduxState => reduxState.slotsManager)(Slots)
