import React, { Component } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'

export default class DepositTokensDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: ''
        }
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

    onAmountChangedListener = (event, value) => {
        this.setState({ amount: value })
    }

    onDepositListener = () => {
        if (this.isValid()) {
            this.props.onConfirm(this.state.amount)
            this.onCloseDialogListener()
        }
    }

    onCloseDialogListener = () => this.props.toggleDialog(false)

    render() {
        let { sessionNumber } = this.props
        let isValid = this.isValid()

        let title = `Deposit tokens to Sportsbook for session ${sessionNumber}`
        let errorMessage = null
        if (!isValid) {
            errorMessage = this.state.amount
                ? 'You do not have enough DBETs. Please enter a valid amount and try again.'
                : 'Please enter a valid amount of DBETs'
        }
        let balance = this.props.balance || 0
        return (
            <Dialog
                title={title}
                actions={
                    <FlatButton
                        label="Deposit"
                        primary={true}
                        disabled={!isValid}
                        onClick={this.onDepositListener}
                    />
                }
                modal={false}
                open={this.props.open}
                onRequestClose={this.onCloseDialogListener}
            >
                <TextField
                    floatingLabelText="Amount"
                    fullWidth={true}
                    type="number"
                    value={this.state.amount}
                    onChange={this.onAmountChangedListener}
                    errorText={errorMessage}
                />
                <p className="color-gold">
                    Available balance: {balance.toFixed(2)} DBETs
                </p>
                <br />
                Please note that if you haven't set an allowance for the
                sportsbook to transfer DBETs to it's contract address, you will
                be prompted to do so now and will have to send 2 transactions to
                the network.
            </Dialog>
        )
    }
}
