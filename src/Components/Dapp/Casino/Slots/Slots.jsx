import React, { Component } from 'react'
import SlotsList from './SlotsList'
import StateChannelBuilder from './StateChannelBuilder'
import StateChannelWaiter from './StateChannelWaiter'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import {
    Actions,
    initWatchers,
    stopWatchers
} from '../../../../Model/slotsManager'

import './slots.css'

class Slots extends Component {
    componentDidMount = () => {
        this.props.dispatch(Actions.getSessionId())
        this.props.dispatch(Actions.getBalance())
        this.props.dispatch(Actions.getAllowance())

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
        return (
            <main className="slots container">
                <StateChannelBuilder
                    onBuildChannelListener={this.onBuildChannelListener}
                    isBuildingChannel={this.props.isBuildingChannel}
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
