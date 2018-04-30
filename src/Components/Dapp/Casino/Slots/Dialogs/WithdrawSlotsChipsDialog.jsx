import React, { Component } from 'react'
import { Dialog, CircularProgress, FlatButton, TextField } from 'material-ui'
import { COLOR_GOLD } from '../../../../Constants'
import ethUnits from 'ethereum-units'

export default class WithdrawSlotsChipsDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: ''
        }
    }

    isValid = () => this.state.amount.length > 0

    onCloseListener = () => this.props.toggleDialog(false)

    onClickListener = () => {
        if (this.isValid()) {
            let ether = ethUnits
                .convert(this.state.amount, 'ether', 'wei')
                .toString()
            this.props.onWithdrawChips(ether)
        }
    }

    onValueChanged = (event, value) => this.setState({ amount: value })

    renderBalanceLabel = () => {
        if (this.props.balance != null) {
            return this.props.balance
        } else {
            return <CircularProgress color={COLOR_GOLD} size={18} />
        }
    }

    render() {
        return (
            <Dialog
                title="Withdraw Slots Chips"
                actions={
                    <FlatButton
                        label="Get Chips"
                        primary={true}
                        disabled={!this.isValid()}
                        onClick={this.onClickListener}
                    />
                }
                modal={false}
                open={this.props.open}
                onRequestClose={this.onCloseListener}
            >
                <TextField
                    floatingLabelText="Amount of Chips"
                    fullWidth={true}
                    type="number"
                    value={this.state.amount}
                    onChange={this.onValueChanged}
                />
                <small className="text-white">
                    Enter the amount of chips you would like to withdraw from
                    the Slots Manager Contract.
                </small>
                <br />
                <small className="color-gold">
                    Available slots chips: {this.renderBalanceLabel()} DBETs
                </small>
            </Dialog>
        )
    }
}
