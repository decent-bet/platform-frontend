import React from 'react'
import { Card, CardText, CardHeader } from 'material-ui'
import { channelBalanceParser } from '../functions'

export default function StateChannelTable({
    activeChannels,
    channelMap,
    children,
    title,
    subtitle
}) {
    // List all existing channels for this user
    const array = activeChannels.map(channelId => {
        const channel = channelMap[channelId]
        // Parse the balance from the state
        let totalTokens = channelBalanceParser(channel)
        return (
            <tr key={channelId}>
                <td>{totalTokens}</td>
                <td>{channel.channelId}</td>
                <td>{children(channel)}</td>
            </tr>
        )
    })

    // If there are no rows, hide the table
    if (array.length <= 0) return null

    return (
        <Card className="card">
            <CardHeader title={title} subtitle={subtitle}/>
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
