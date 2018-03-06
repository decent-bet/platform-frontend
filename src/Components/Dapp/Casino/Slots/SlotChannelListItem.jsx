import React, { Component } from 'react'
import { FlatButton, MuiThemeProvider, CircularProgress } from 'material-ui'
import Helper from '../../../Helper'
import Themes from '../../../Base/Themes'

const themes = new Themes()
const helper = new Helper()
const constants = require('./../../../Constants')

export default class SlotChannelListItem extends Component {
    // Deposit Button Clicked
    onDepositClickedListener = () =>
        this.props.onDepositToChannelListener(this.props.id)

    render() {
        let { id, stateChannel } = this.props
        let tokenAmountLabel = stateChannel.hasOwnProperty('initialDeposit')
            ? helper
                  .getWeb3()
                  .utils.fromWei(stateChannel.initialDeposit.toString())
            : <CircularProgress size={18} color={constants.COLOR_GOLD} /> +
              ' DBETS'
        return (
            <tr>
                <th scope="row">
                    <p>{id}</p>
                </th>
                <td>
                    <p>{tokenAmountLabel}</p>
                </td>
                <td>
                    <p>{stateChannel.status}</p>
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
