/**
 * Created by user on 8/21/2017.
 */

import React, { Component } from 'react'
import {
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from '@material-ui/core'

export default class PurchaseCreditsDialog extends Component {
    state = {
        amount: ''
    }

    onAmountChangedListener = event =>
        this.setState({ amount: event.target.value })

    isAmountValid = () => {
        const amount = parseInt(this.state.amount, 10)
        const balance = parseInt(this.props.balance, 10)
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
        const adjustedSessionNumber =
            this.props.sessionNumber === '0' ? 1 : this.props.sessionNumber
        const isValueValid = this.isAmountValid()
        const amount = parseInt(this.state.amount, 10) || ''
        let errorMessage = null
        if (!isValueValid) {
            errorMessage = amount
                ? `You do not have enough DBETs to purchase ${amount} credits`
                : 'Please enter a valid amount of DBETs'
        }
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={this.props.onCloseListener}
            >
                <DialogTitle>
                    Purchase Credits for Session {adjustedSessionNumber}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Amount"
                        fullWidth
                        type="number"
                        value={amount}
                        onChange={this.onAmountChangedListener}
                        error={!isValueValid}
                        helperText={errorMessage}
                    />
                    <DialogContentText>
                        <small className="color-gold">
                            Available balance: {this.props.balance} DBETs
                        </small>
                        <br />
                        Please note that if you haven't set an allowance for the
                        house to transfer DBETs to it's contract address, you
                        will be prompted to do so now and will have to send 2
                        transactions to the network.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="raised"
                        disabled={!isValueValid}
                        color="primary"
                        onClick={this.onClickListener}
                    >
                        Purchase
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
