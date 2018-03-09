import React, { Component } from 'react'
import { FlatButton, MuiThemeProvider, CircularProgress } from 'material-ui'
import Helper from '../../../Helper'
import Themes from '../../../Base/Themes'

const themes = new Themes()
const helper = new Helper()
const constants = require('./../../../Constants')

export default class SlotChannelListItem extends Component {
    // Translates the Channel Status into an extended message
    getFormattedChannelStatus = () => {
        switch (this.props.stateChannel.status) {
            case constants.CHANNEL_STATUS_WAITING:
                return constants.FORMATTED_CHANNEL_STATUS_WAITING
            case constants.CHANNEL_STATUS_DEPOSITED:
                return constants.FORMATTED_CHANNEL_STATUS_DEPOSITED
            case constants.CHANNEL_STATUS_ACTIVATED:
                return constants.FORMATTED_CHANNEL_STATUS_ACTIVATED
            case constants.CHANNEL_STATUS_FINALIZED:
                return constants.FORMATTED_CHANNEL_STATUS_FINALIZED
            default:
                return ''
        }
    }

    // Displays the total Chips in the channel
    getChipAmountLabel = () => {
        let { stateChannel } = this.props
        if (stateChannel.hasOwnProperty('initialDeposit')) {
            let initialDeposit = stateChannel.initialDeposit.toString()
            return helper.getWeb3().utils.fromWei(initialDeposit)
        } else {
            return <CircularProgress size={18} color={constants.COLOR_GOLD} />
        }
    }

    // Deposit Button Clicked
    onDepositClickedListener = () =>
        this.props.onDepositToChannelListener(this.props.id)

    render() {
        let { id, stateChannel } = this.props
        return (
            <tr>
                <th scope="row">
                    <p>{id}</p>
                </th>
                <td>
                    <p>{`${this.getChipAmountLabel()} DBETs`}</p>
                </td>
                <td>
                    <p>{this.getFormattedChannelStatus()}</p>
                </td>
                <MuiThemeProvider muiTheme={themes.getButtons()}>
                    <td>
                        <FlatButton
                            label="Deposit"
                            disabled={
                                stateChannel.status !==
                                constants.CHANNEL_STATUS_WAITING
                            }
                            onClick={this.onDepositClickedListener}
                        />

                        <FlatButton
                            label="Play"
                            className="ml-4"
                            disabled={
                                stateChannel.status !==
                                constants.CHANNEL_STATUS_ACTIVATED
                            }
                            href={'/slots/game?id=' + id}
                        />

                        <FlatButton
                            label="Claim DBETs"
                            disabled={
                                !(
                                    stateChannel.status ===
                                        constants.CHANNEL_STATUS_FINALIZED &&
                                    !stateChannel.hasOwnProperty('claimed')
                                )
                            }
                            className="ml-4"
                            href={'/slots/game?id=' + id}
                        />
                    </td>
                </MuiThemeProvider>
            </tr>
        )
    }
}