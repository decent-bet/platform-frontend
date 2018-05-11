import React, { Fragment } from 'react'
import { CardText, CardHeader } from 'material-ui'
import { channelBalanceParser } from '../functions'

export default function ActiveChannelArray({
    activeChannels,
    channelMap,
    children
}) {
    // List all existing channels for this user
    const activeChannelArray = activeChannels.map(channelId => {
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
    if (activeChannelArray.length <= 0) return null

    return (
      <Fragment>
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
                    <tbody>{activeChannelArray}</tbody>
                </table>
            </CardText>
        </Fragment>
    )
}
