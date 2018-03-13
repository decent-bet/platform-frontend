/**
 * Created by user on 8/21/2017.
 */

import * as React from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'

const styles = require('./../../../Base/DialogStyles').styles

/**
 * Props Interfaces
 */
export interface PurchaseCreditsDialogProps {
    open: boolean
    sessionNumber: number
    onConfirm: OnConfirmListener
    allowance: number
    balance: number
    toggleDialog: OnToggleDialogListener
}
export interface OnConfirmListener {
    (amount: number): void
}

export interface OnToggleDialogListener {
    (toogle: boolean): void
}

/**
 * State Interfaces
 */
export interface PurchaseCreditsDialogState {
    amount: string
    valid: {
        error: boolean
        message: string
    }
}

export default class PurchaseCreditsDialog extends React.Component<
    PurchaseCreditsDialogProps,
    PurchaseCreditsDialogState
> {
    constructor(props: PurchaseCreditsDialogProps) {
        super(props)
        this.state = {
            amount: '',
            valid: {
                error: false,
                message: ''
            }
        }
    }

    toggleDialog = (enabled: boolean): void => {
        this.props.toggleDialog(enabled)
    }

    onCloseListener = (): void => {
        this.toggleDialog(false)
    }

    onConfirmListener = (): void => {
        let amount = parseInt(this.state.amount)
        let balance = this.props.balance
        let listener = this.props.onConfirm
        if (amount <= balance) {
            listener(amount)
            this.toggleDialog(false)
        } else {
            let message = amount
                ? `You do not have enough DBETs to purchase ${amount} credits`
                : 'Please enter a valid amount of DBETs'
            this.setState({ valid: { error: true, message: message } })
        }
    }

    onChangeListener = (event: React.FormEvent<{}>, value: string): void => {
        this.setState({ amount: value })
    }

    renderActions = (): React.ReactElement<{}> => {
        let isDisabled =
            this.state.amount.length == 0 || parseInt(this.state.amount) == 0
        return (
            <FlatButton
                labelStyle={styles.floatingLabelStyle}
                label="Purchase"
                disabled={isDisabled}
                primary={true}
                onClick={this.onConfirmListener}
            />
        )
    }

    render() {
        let title: string =
            'PURCHASE CREDITS FOR SESSION ' + this.props.sessionNumber
        let errorText = this.state.valid.error ? this.state.valid.error : null
        return (
            <Dialog
                title={title}
                actions={[this.renderActions()]}
                modal={false}
                open={this.props.open}
                onRequestClose={this.onCloseListener}
            >
                <TextField
                    floatingLabelText="Amount"
                    fullWidth={true}
                    type="number"
                    value={this.state.amount}
                    onChange={this.onChangeListener}
                    errorText={errorText}
                    hintStyle={{ color: '#949494' }}
                    inputStyle={styles.inputStyle}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    underlineFocusStyle={styles.underlineStyle}
                    underlineDisabledStyle={styles.underlineDisabledStyle}
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
