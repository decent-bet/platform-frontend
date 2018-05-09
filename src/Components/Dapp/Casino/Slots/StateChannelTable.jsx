import React from 'react'
import { Card, CardText, CardHeader } from 'material-ui'
import { channelBalanceParser, isChannelClaimed } from '../functions'

export default function StateChannelTable({ channelMap, children }) {
    // List all existing channels for this user
    const array = []
    for (const channelId in channelMap) {
        if (channelMap.hasOwnProperty(channelId)) {
            const channel = channelMap[channelId]
            const isClaimed = isChannelClaimed(channel)

            // Is channel still usable?
            if (channel.info.ready && channel.info.activated && !isClaimed) {
                // Parse the balance from the state
                let totalTokens = channelBalanceParser(channel)

                // Send the row
                array.push(
                    <tr key={channelId}>
                        <td>{totalTokens}</td>
                        <td>{channel.channelId}</td>
                        <td>{children(channel)}</td>
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
