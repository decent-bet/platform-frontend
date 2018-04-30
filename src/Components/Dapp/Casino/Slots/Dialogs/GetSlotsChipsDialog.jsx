/**
 * Created by user on 10/2/2017.
 */

import React, { Component } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import ethUnits from 'ethereum-units'

export default class GetSlotsChipsDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: ''
        }
    }

    onClick = () => {
        if (this.state.amount.length > 0)
            this.props.onGetChips(
                ethUnits.convert(this.state.amount, 'ether', 'wei')
            )
    }

    onCloseListener = () => this.props.toggleDialog(false)
    onValueChangedListener = (event, value) => this.setState({ amount: value })

    render() {

        let allowance = this.props.allowance || 0
        return (
            <Dialog
                title="Get Slots Chips"
                actions={
                    <FlatButton
                        label="Get Chips"
                        primary={true}
                        onClick={this.onClick}
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
                    onChange={this.onValueChangedListener}
                />
                <small className="text-white">
                    Enter the amount of DBETs you would like to exchange for
                    slots chips. If you haven't set enough slot allowance to
                    cover the chips amount, an additional transaction will be
                    made to set the allowance.
                </small>
                <br />
                <small className="color-gold">
                    Current slots allowance: {allowance.toFixed(2)} DBETs
                </small>
            </Dialog>
        )
    }
}
