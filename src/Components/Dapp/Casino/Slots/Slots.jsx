import React, { Component, Fragment } from 'react'
import { CircularProgress } from 'material-ui'
import SlotsGameCard from './SlotsGameCard'
import SlotsChannelList from './SlotChannelList'
import ChipToolbar from './ChipToolbar'
import GetSlotsChipsDialog from './Dialogs/GetSlotsChipsDialog'
import NewChannelDialog from './Dialogs/NewChannelDialog'
import WithdrawSlotsChipsDialog from './Dialogs/WithdrawSlotsChipsDialog'
import Helper from '../../../Helper'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import {
    Actions,
    initWatchers,
    stopWatchers
} from '../../../../Model/slotsManager'
import { COLOR_GOLD } from '../../../Constants'

import './slots.css'

const helper = new Helper()

class Slots extends Component {
    state = {
        isDialogNewChannelOpen: false,
        isDialogGetChipsOpen: false,
        isDialogWithdrawChipsOpen: false
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

    // Create a new Channel
    onCreateChannelListener = deposit => {
        let action = Actions.createChannel(deposit.toString())
        this.props.dispatch(action)
        this.onNewChannelDialogToggleListener(false)
    }

    // Deposit to a Channel
    onDepositToChannelListener = id => {
        let action = Actions.depositToChannel(id)
        this.props.dispatch(action)
    }

    // Opens the New Channel Dialog
    onNewChannelDialogOpenListener = () =>
        this.onNewChannelDialogToggleListener(true)
    onNewChannelDialogToggleListener = isOpen =>
        this.setState({ isDialogNewChannelOpen: isOpen })

    // Click the Slots Card
    onSlotsGameClickedListener = () => this.onNewChannelDialogOpenListener(true)

    // Opens the dialog to withdraw chips
    onWithdrawChipsDialogOpenListener = () =>
        this.onWithdrawChipsDialogToggleListener(true)
    onWithdrawChipsDialogToggleListener = isOpen =>
        this.setState({ isDialogWithdrawChipsOpen: isOpen })

    // Withdraw Chips from the State Channel
    onWithdrawChipsListener = amount => {
        let rawBalance = this.props.balance
        console.log('onWithdrawChips', amount, rawBalance)
        let balance = new BigNumber(rawBalance)
        if (balance.isGreaterThanOrEqualTo(amount)) {
            let action = Actions.withdrawChips(amount.toString())
            this.props.dispatch(action)
        }
        this.onWithdrawChipsDialogToggleListener(false)
    }

    // Opens the Dialog to deposits tokens and transform them into Chips
    onGetChipsDialogOpenListener = () =>
        this.onGetChipsDialogToggleListener(true)
    onGetChipsDialogToggleListener = isOpen =>
        this.setState({ isDialogGetChipsOpen: isOpen })

    // Deposit Tokens and convert them to Chips
    onGetChipsListener = amount => {
        let allowance = new BigNumber(this.props.allowance)
        let string = amount.toString()
        let action = allowance.isLessThan(amount)
            ? Actions.approveAndDepositChips(string)
            : Actions.depositChips(string)
        this.props.dispatch(action)
        this.onGetChipsDialogToggleListener(false)
    }

    onGoToGameroomListener = gameID =>
        this.props.history.push(`/slots/${gameID}`)

    renderChipToolbar = () => {
        // Prints the amount of available Chips, or a loader component
        let chipBalance = this.getChipBalance()
        let progressbar = <CircularProgress size={18} color={COLOR_GOLD} />

        // inspiration for the regex: https://stackoverflow.com/a/14428340
        let chipsLabel = chipBalance
            ? chipBalance.replace(/(\d)(?=(\d{3}))/g, '$1,') // Adds a space every three digits
            : progressbar

        return (
            <ChipToolbar
                onWithdrawChipsListener={this.onWithdrawChipsDialogOpenListener}
                onGetChipsListener={this.onGetChipsDialogOpenListener}
                chipsLabel={chipsLabel}
            />
        )
    }

    renderDialogs = () => (
        <Fragment>
            <WithdrawSlotsChipsDialog
                open={this.state.isDialogWithdrawChipsOpen}
                balance={this.getChipBalance('')}
                onWithdrawChips={this.onWithdrawChipsListener}
                toggleDialog={this.onWithdrawChipsDialogToggleListener}
            />
            <GetSlotsChipsDialog
                open={this.state.isDialogGetChipsOpen}
                allowance={this.props.allowance}
                onGetChips={this.onGetChipsListener}
                toggleDialog={this.onGetChipsDialogToggleListener}
            />
            <NewChannelDialog
                open={this.state.isDialogNewChannelOpen}
                onCreateChannel={this.onCreateChannelListener}
                toggleDialog={this.onNewChannelDialogToggleListener}
            />
        </Fragment>
    )

    render() {
        return (
            <main className="slots container">
                {this.renderChipToolbar()}

                <SlotsGameCard
                    imageUrl="backgrounds/slots-crypto-chaos.png"
                    onClickListener={this.onSlotsGameClickedListener}
                />

                <SlotsChannelList
                    stateChannels={this.props.channels}
                    onDepositToChannelListener={this.onDepositToChannelListener}
                    onGoToGameroomListener={this.onGoToGameroomListener}
                />

                {this.renderDialogs()}
            </main>
        )
    }
}

export default connect(reduxState => reduxState.slotsManager)(Slots)
