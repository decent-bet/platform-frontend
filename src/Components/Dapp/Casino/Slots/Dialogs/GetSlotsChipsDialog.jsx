/**
 * Created by user on 10/2/2017.
 */

import React, { Component } from 'react'
import { Dialog, CircularProgress, FlatButton, TextField } from 'material-ui'

const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')

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

    renderAllowanceLabel = () => {
        if (this.props.allowance != null) {
            return ethUnits
                .convert(this.props.allowance, 'wei', 'ether')
                .toString()
        } else {
            return <CircularProgress color={constants.COLOR_GOLD} size={18} />
        }
    }

    render() {
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
                    Current slots allowance: {this.renderAllowanceLabel()} DBETs
                </small>
            </Dialog>
        )
    }
}
