import * as React from 'react'
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'
import { units } from 'ethereum-units'

interface IStateChannelProps {
    claimableChannels: any[]
    channelMap: any
    channelProp: any
}

export default function StateChannelTable({
    claimableChannels,
    channelMap,
    channelProp
}: IStateChannelProps) {
    // List all existing channels for this user and filter all channels with more then 0 tokens

    const claimableChannelsComponents = claimableChannels
        .map(channelId => {
            const channel = channelMap[channelId]
            // Parse the balance from the state
            const totalTokens = channel.finalBalances
                .dividedBy(units.ether)
                .toFixed()
            return {
                channelId,
                channel,
                totalTokens
            }
        })
        .filter(item => item.totalTokens > 0)
        .map(item => {
            return (
                <CardContent key={item.channelId}>
                    <Typography>You have {item.totalTokens} chips</Typography>
                    {channelProp(item.channel)}
                </CardContent>
            )
        })

    // If there are no rows, hide the table
    if (claimableChannelsComponents.length <= 0) return null

    return (
        <Card className="card">
            <CardHeader
                title="Finished Slot Games"
                subheader="You must wait 15 minutes after exiting to claim these games"
            />
            {claimableChannelsComponents}
        </Card>
    )
}
