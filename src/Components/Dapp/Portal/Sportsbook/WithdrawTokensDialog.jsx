import React, { Component } from 'react'
import { Dialog, Button, TextField } from '@material-ui/core'
import Helper from '../../../Helper'

const helper = new Helper()

export default class WithdrawTokensDialog extends Component {
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

    onCloseDialogListener = () => this.props.toggleDialog(false)

    onChangeValueListener = (event, value) => {
        this.setState({ amount: value })
    }

    onWithdrawListener = () => {
        if (this.isValid()) {
            this.props.onConfirm(this.state.amount)
            this.onCloseDialogListener()
        }
    }

    render() {
        let isValid = this.isValid()
        let title = 'Withdraw Token from Session ' + this.props.sessionNumber
        let errorMessage = ''
        if (!isValid) {
            errorMessage = this.state.amount
                ? 'Amount is greater than available DBETs. Please enter a valid amount and try again.'
                : 'Please enter a valid amount of DBETs'
        }
        return (
            <Dialog
                title={title}
                actions={
                    <Button
                        variant="flat"
                        color="primary"
                        disabled={!isValid}
                        onClick={this.onWithdrawListener}
                    >
                        Withdraw
                    </Button>
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
                    onChange={this.onChangeValueListener}
                    errorText={errorMessage}
                />
                <p className="color-gold">
                    Available balance: {helper.formatEther(this.props.balance)}{' '}
                    DBETs
                </p>
            </Dialog>
        )
    }
}
