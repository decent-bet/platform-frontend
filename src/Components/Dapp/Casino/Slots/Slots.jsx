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
import SlotsManagerActions from '../../../../Model/actions/slotsManagerActions'
import SlotsManagerWatchers from '../../../../Model/watchers/slotsManagerWatcher'
import { COLOR_GOLD } from '../../../Constants'

import './slots.css'

const helper = new Helper()

class Slots extends Component {
    state = {
        address: helper.getWeb3().eth.defaultAccount,
        isDialogNewChannelOpen: false,
        isDialogGetChipsOpen: false,
        isDialogWithdrawChipsOpen: false
    }

    componentDidMount = () => {
        this.props.dispatch(SlotsManagerActions.slotChannel.getSessionId())
        this.props.dispatch(SlotsManagerActions.slotChannel.getBalance())
        this.props.dispatch(SlotsManagerActions.slotChannel.getAllowance())

        // Init Watchers
        this.props.dispatch(SlotsManagerWatchers.init)
    }

    componentWillUnmount = () => {
        // Stop watchers
        this.props.dispatch(SlotsManagerWatchers.stop)
    }

    // How many Chips are in the session? if session isn't open, print `placeholder`
    getChipBalance = (placeholder = null) => {
        if (this.props.currentSession >= 0) {
            let balance = this.props.balances[this.props.currentSession]
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
        let action = SlotsManagerActions.slotChannel.createChannel(
            deposit.toString()
        )
        this.props.dispatch(action)
        this.onNewChannelDialogToggleListener(false)
    }

    // Deposit to a Channel
    onDepositToChannelListener = id => {
        let action = SlotsManagerActions.slotChannel.depositToChannel(id)
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
        let rawBalance = this.props.balances[this.props.currentSession]
        console.log('onWithdrawChips', amount, rawBalance)
        let balance = new BigNumber(rawBalance)
        if (balance.isGreaterThanOrEqualTo(amount)) {
            let action = SlotsManagerActions.slotChannel.withdrawChips(
                amount.toString()
            )
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
            ? SlotsManagerActions.slotChannel.approveAndDepositChips(string)
            : SlotsManagerActions.slotChannel.depositChips(string)
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
        let logoUrl =
            process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.svg'
        return (
            <main className="slots container">
                <section className="logo-container">
                    <img src={logoUrl} className="logo" alt="Decent.bet Logo" />
                </section>

                <section className="title-container">
                    <h3 className="text-center">SLOTS</h3>
                </section>

                <section className="intro-container">
                    <h5 className="text-center">
                        Select a slot machine from the variety{' '}
                        <span className="text-gold">Decent.bet </span> offers to
                        start a new channel
                    </h5>
                </section>

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
