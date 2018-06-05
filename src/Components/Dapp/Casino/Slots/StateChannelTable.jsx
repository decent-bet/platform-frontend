import React from 'react'
import { Card, CardContent, CardHeader } from '@material-ui/core'
import { channelBalanceParser } from '../functions'

export default function StateChannelTable({
    claimableChannels,
    channelMap,
    children
}) {
    // List all existing channels for this user
    const claimableChannelsArray = claimableChannels.map(channelId => {
        const channel = channelMap[channelId]

        // Parse the balance from the state
        const totalTokens = channelBalanceParser(channel)
        const text = `You have ${totalTokens} chips`
        return (
            <CardContent key={channelId}>
                <p>{text}</p>
                {children(channel)}
            </CardContent>
        )
    })

    // If there are no rows, hide the table
    if (claimableChannelsArray.length <= 0) return null

    return (
        <Card className="card">
            <CardHeader
                title="Finished Slot Games"
                subtitle="You must wait 1 minute after exiting to claim these games"
            />
            {claimableChannelsArray}
        </Card>
    )
}
