import React from 'react'
import { Card } from 'material-ui'
import ActiveChannelTable from './ActiveChannelTable'
import ClaimableChannelTable from './ClaimableChannelTable'

export default function StateChannelTable({
    activeChannels,
    claimableChannels,
    channelMap,
    children
}) {
    return (
        <Card className="card">
            <ActiveChannelTable
                channelMap={channelMap}
                activeChannels={activeChannels}
                children={children}
            />
            
            <ClaimableChannelTable
                channelMap={channelMap}
                children={children}
                claimableChannels={claimableChannels}
            />
        </Card>
    )
}
