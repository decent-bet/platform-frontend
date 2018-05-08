import React, { Component } from 'react'
import { Card, CardText, CardHeader, RaisedButton } from 'material-ui'
import { units } from 'ethereum-units'
import BigNumber from 'bignumber.js'

// The "Use" buttons are stateful. They must rememeber their channelId for it to work
class GoToChannelButton extends Component {
    onGoToChannelListener = () => {
        this.props.onClick(this.props.channelId)
    }

    render() {
        const { onClick, channelId, ...rest } = this.props
        return <RaisedButton {...rest} onClick={this.onGoToChannelListener} />
    }
}

export default function StateChannelTable({
    channelMap,
    onSelectChannelListener
}) {
    // List all existing channels for this user
    const array = []
    for (const channelId in channelMap) {
        if (channelMap.hasOwnProperty(channelId)) {
            const channel = channelMap[channelId]

            // Is channel still usable?
            if (
                channel.info.ready &&
                channel.info.activated &&
                !channel.info.finalized
            ) {
                // Parse the balance from the state
                let totalTokens = channel.info ? channel.info.initialDeposit : 0
                if (channel.houseSpins && channel.houseSpins.length > 0) {
                    const lastIdx = channel.houseSpins.length - 1
                    const rawBalance = channel.houseSpins[lastIdx].userBalance
                    totalTokens = new BigNumber(rawBalance)
                }
                totalTokens = totalTokens.dividedBy(units.ether).toFixed(2)

                // Send the row
                array.push(
                    <tr key={channelId}>
                        <td>{totalTokens}</td>
                        <td>{channel.channelId}</td>
                        <td>
                            <GoToChannelButton
                                channelId={channelId}
                                label="Use"
                                primary={true}
                                onClick={onSelectChannelListener}
                            />
                        </td>
                    </tr>
                )
            }
        }
    }

    // If there are no rows, hide the table
    if (array.length <= 0) return null

    return (
        <Card className="card">
            <CardHeader title="Use an existing State Channel" />
            <CardText className="channel-table">
                <table>
                    <thead>
                        <tr>
                            <th>Deposited Tokens</th>
                            <th>Channel Id</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>{array}</tbody>
                </table>
            </CardText>
        </Card>
    )
}
