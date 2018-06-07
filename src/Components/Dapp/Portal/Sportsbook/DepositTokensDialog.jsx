import React, { Component } from 'react'
import {
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core'

export default class DepositTokensDialog extends Component {
    state = {
        amount: ''
    }

    isValid = () => {
        let parsedAmount = parseInt(this.state.amount, 10)
        let parsedBalance = parseInt(this.props.balance, 10)
        return (
            this.state.amount.length >= 0 &&
            parsedAmount !== 0 &&
            parsedAmount <= parsedBalance
        )
    }

    onAmountChangedListener = event => {
        this.setState({ amount: event.target.value })
    }

    onDepositListener = () => {
        if (this.isValid()) {
            this.props.onConfirm(this.state.amount)
            this.onCloseDialogListener()
        }
    }

    onCloseDialogListener = () => this.props.toggleDialog(false)

    render() {
        const { sessionNumber } = this.props
        const isValid = this.isValid()

        const title = `Deposit tokens to Sportsbook for session ${sessionNumber}`
        let errorMessage = null
        if (!isValid) {
            errorMessage = this.state.amount
                ? 'You do not have enough DBETs. Please enter a valid amount and try again.'
                : 'Please enter a valid amount of DBETs'
        }
        const balance = this.props.balance || 0
        return (
            <Dialog open={this.props.open} onClose={this.onCloseDialogListener}>
                <DialogTitle>{title}</DialogTitle>

                <DialogContent>
                    <TextField
                        label="Amount"
                        fullWidth
                        type="number"
                        value={this.state.amount}
                        onChange={this.onAmountChangedListener}
                        error={!isValid}
                        helperText={errorMessage}
                    />
                    <DialogContentText className="color-gold">
                        Available balance: {balance.toFixed(2)} DBETs
                    </DialogContentText>
                    <br />
                    <DialogContentText>
                        Please note that if you haven't set an allowance for the
                        sportsbook to transfer DBETs to it's contract address,
                        you will be prompted to do so now and will have to send
                        2 transactions to the network.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="flat"
                        color="primary"
                        disabled={!isValid}
                        onClick={this.onDepositListener}
                    >
                        Deposit
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
