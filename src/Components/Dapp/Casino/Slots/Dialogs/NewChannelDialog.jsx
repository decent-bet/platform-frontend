/**
 * Created by user on 10/2/2017.
 */

import React, { Component, Fragment } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'

const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')

export default class NewChannelDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deposit: ''
        }
    }

    onClickListener = () => {
        if (this.state.deposit) {
            let deposit = parseInt(this.state.deposit, 10)
            if (
                deposit >= constants.SLOTS_CHANNEL_DEPOSIT_MIN &&
                deposit <= constants.SLOTS_CHANNEL_DEPOSIT_MAX
            ) {
                let ether = ethUnits.convert(this.state.deposit, 'ether', 'wei')
                this.props.onCreateChannel(ether)
            }
        }
    }

    onCloseListener = () => this.props.toggleDialog(false)
    onDepositChanged = (event, value) => {
        this.setState({ deposit: value })
    }

    render() {
        return (
            <Dialog
                title="New Channel"
                actions={
                    <FlatButton
                        label="Create Channel"
                        primary={true}
                        onClick={this.onClickListener}
                    />
                }
                modal={false}
                open={this.props.open}
                onRequestClose={this.onCloseListener}
            >
                <Fragment>
                    <TextField
                        floatingLabelText="Deposit Amount"
                        fullWidth={true}
                        type="number"
                        value={this.state.deposit}
                        onChange={this.onDepositChanged}
                    />
                    <small className="text-white">
                        Enter the amount of chips you would like to deposit into
                        the new slots channel (100 - 1000 chips).
                    </small>
                </Fragment>
            </Dialog>
        )
    }
}
