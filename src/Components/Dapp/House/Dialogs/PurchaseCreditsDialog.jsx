/**
 * Created by user on 8/21/2017.
 */

import React, { Component } from 'react'
import { Dialog, RaisedButton, TextField } from 'material-ui'

export default class PurchaseCreditsDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: ''
        }
    }

    onAmountChangedListener = (event, value) => this.setState({ amount: value })

    isAmountValid = () => {
        let amount = parseInt(this.state.amount, 10)
        let balance = parseInt(this.props.balance, 10)
        if (!amount) {
            // Amount invalid
            return false
        }
        if (amount <= balance) {
            // Valid if over 0
            return amount > 0
        } else {
            // Below Balance
            return false
        }
    }

    onClickListener = event => {
        this.props.onCloseListener()
        this.props.onConfirmListener(this.state.amount)
    }

    render() {
        let adjustedSessionNumber = this.props.sessionNumber === '0' ? 1 : this.props.sessionNumber
        let title = `PURCHASE CREDITS FOR SESSION ${adjustedSessionNumber}`
        let isValueValid = this.isAmountValid()
        let amount = parseInt(this.state.amount, 10)
        let errorMessage = null
        if (!isValueValid) {
            errorMessage = amount
                ? `You do not have enough DBETs to purchase ${amount} credits`
                : 'Please enter a valid amount of DBETs'
        }
        return (
            <Dialog
                title={title}
                actions={
                    <RaisedButton
                        label="Purchase"
                        disabled={!isValueValid}
                        primary={true}
                        onClick={this.onClickListener}
                    />
                }
                modal={false}
                open={this.props.isOpen}
                onRequestClose={this.props.onCloseListener}
            >
                <TextField
                    floatingLabelText="Amount"
                    fullWidth={true}
                    type="number"
                    value={this.state.amount}
                    onChange={this.onAmountChangedListener}
                    errorText={errorMessage}
                />
                <small className="color-gold">
                    Available balance: {this.props.balance} DBETs
                </small>
                <br />
                <small className="text-white">
                    Please note that if you haven't set an allowance for the
                    house to transfer DBETs to it's contract address, you will
                    be prompted to do so now and will have to send 2
                    transactions to the network.
                </small>
            </Dialog>
        )
    }
}
