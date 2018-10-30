import React from 'react'
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

import { units } from 'ethereum-units'

export default function StateChannelTable({
    claimableChannels,
    channelMap,
    channelProp
}) {
    // List all existing channels for this user
    const claimableChannelsArray = claimableChannels.map(channelId => {
        const channel = channelMap[channelId]

        // Parse the balance from the state
        const totalTokens = channel.finalBalances
            .dividedBy(units.ether)
            .toFixed()
        return (
            <CardContent key={channelId}>
                <Typography>You have {totalTokens} chips</Typography>
                {channelProp(channel)}
            </CardContent>
        )
    })

    // If there are no rows, hide the table
    if (claimableChannelsArray.length <= 0) return null

    return (
        <Card className="card">
            <CardHeader
                title="Finished Slot Games"
                subheader="You must wait 15 minutes after exiting to claim these games"
            />
            {claimableChannelsArray}
        </Card>
    )
}
