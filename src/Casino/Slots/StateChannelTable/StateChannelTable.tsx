import * as React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button
} from '@material-ui/core'
import { units } from 'ethereum-units'
import IStateChannelProps from './IStateChannelProps'

export default function StateChannelTable({
    claimableChannels,
    channelMap,
    channelProp,
    userBalance,
    onClaimFromContract
}: IStateChannelProps) {
    // List all existing channels for this user and filter all channels with more then 0 tokens

    let claimableChannelsComponents = claimableChannels
        .map(channelId => {
            const channel = channelMap[channelId]
            // Parse the balance from the state
            const totalTokens = channel.finalBalances
                .dividedBy(units.ether)
                .toFixed(2)
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

    if (parseFloat(userBalance) > 0) {
        claimableChannelsComponents.push(
            <CardContent key={claimableChannelsComponents.length}>
                <Typography>You have {userBalance} chips</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClaimFromContract}
                >
                    Claim DBETs
                </Button>
            </CardContent>
        )
    }

    // If there are no rows, hide the table
    if (claimableChannelsComponents.length <= 0) return null

    return (
        <Card className="card">
            <CardHeader
                title="Finished Slot Games"
                subheader="You must wait 15 minutes after finishing your session to claim your DBETs"
            />
            {claimableChannelsComponents}
        </Card>
    )
}
