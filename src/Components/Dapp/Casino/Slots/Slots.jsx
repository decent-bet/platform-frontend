import React, { Component } from 'react'
import SlotsGameCard from './SlotsGameCard'
import SlotsChannelList from './SlotChannelList'
import GetSlotsChipsDialog from './Dialogs/GetSlotsChipsDialog'
import Helper from '../../../Helper'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import {
    Actions,
    initWatchers,
    stopWatchers
} from '../../../../Model/slotsManager'

import './slots.css'

const helper = new Helper()

class Slots extends Component {
    state = {
        isDialogGetChipsOpen: false
    }

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

    // How many Chips are in the session? if session isn't open, print `placeholder`
    getChipBalance = (placeholder = null) => {
        if (this.props.currentSession >= 0) {
            let balance = this.props.balance
            if (balance >= 0) {
                // Session is open. Print token total
                let sessionString = balance.toString()
                return helper.getWeb3().utils.fromWei(sessionString)
            }
        }

        // Session not open. Print Placeholder
        return placeholder
    }

    // Click the Slots Card
    onSlotsGameClickedListener = () => this.onGetChipsDialogOpenListener()

    // Opens the Dialog to deposits tokens and transform them into Chips
    onGetChipsDialogOpenListener = () =>
        this.onGetChipsDialogToggleListener(true)
    onGetChipsDialogToggleListener = isOpen =>
        this.setState({ isDialogGetChipsOpen: isOpen })

    // Builds the entire State Channel in one Step
    onBuildChannelListener = amount => {
        const allowance = new BigNumber(this.props.allowance)
        const parsedAmount = new BigNumber(amount)
        const action = Actions.buildChannel(parsedAmount, allowance)
        this.props.dispatch(action)
        this.onGetChipsDialogToggleListener(false)
    }

    onGoToGameroomListener = gameID =>
        this.props.history.push(`/slots/${gameID}`)

    render() {
        return (
            <main className="slots container">
                <SlotsGameCard
                    imageUrl="backgrounds/slots-crypto-chaos.png"
                    onClickListener={this.onGetChipsDialogOpenListener}
                />

                <SlotsChannelList
                    stateChannels={this.props.channels}
                    onDepositToChannelListener={this.onDepositToChannelListener}
                    onGoToGameroomListener={this.onGoToGameroomListener}
                />

                <GetSlotsChipsDialog
                    open={this.state.isDialogGetChipsOpen}
                    allowance={this.props.allowance}
                    onGetChips={this.onBuildChannelListener}
                    toggleDialog={this.onGetChipsDialogToggleListener}
                />
            </main>
        )
    }
}

export default connect(reduxState => reduxState.slotsManager)(Slots)
