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
import Helper from '../../../Helper'

const helper = new Helper()

export default class WithdrawTokensDialog extends Component {
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

    onCloseDialogListener = () => this.props.toggleDialog(false)

    onChangeValueListener = event => {
        this.setState({ amount: event.target.value })
    }

    onWithdrawListener = () => {
        if (this.isValid()) {
            this.props.onConfirm(this.state.amount)
            this.onCloseDialogListener()
        }
    }

    render() {
        const isValid = this.isValid()
        const title = 'Withdraw Token from Session ' + this.props.sessionNumber
        let errorMessage = ''
        if (!isValid) {
            errorMessage = this.state.amount
                ? 'Amount is greater than available DBETs. Please enter a valid amount and try again.'
                : 'Please enter a valid amount of DBETs'
        }
        return (
            <Dialog open={this.props.open} onClose={this.onCloseDialogListener}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Amount"
                        fullWidth
                        type="number"
                        value={this.state.amount}
                        onChange={this.onChangeValueListener}
                        error={!isValid}
                        helperText={errorMessage}
                    />

                    <DialogContentText>
                        Available balance:{' '}
                        {helper.formatEther(this.props.balance)} DBETs
                    </DialogContentText>

                    <DialogActions>
                        <Button
                            variant="raised"
                            color="primary"
                            disabled={!isValid}
                            onClick={this.onWithdrawListener}
                        >
                            Withdraw
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
}
