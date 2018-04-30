import React from 'react'
import { Card, CardText, CardHeader } from 'material-ui'
import SlotChannelListInner from './SlotChannelListInner'

export default function SlotChannelList({
    stateChannels,
    onDepositToChannelListener,
    onGoToGameroomListener
}) {
    return (
        <Card className="channel-list-card card">
            <CardHeader title="Open Channels" />
            <CardText>
                <span className="text-gold font-weight-bold">Decent.bet </span>
                    relies on "State Channels" to ensure casino users can enjoy
                    lightning fast games while still being secured by smart
                contracts on the blockchain. Listed below are channels created
                from your current address which can be continued or closed at
                any point in time.
                <SlotChannelListInner
                    stateChannels={stateChannels}
                    onDepositToChannelListener={onDepositToChannelListener}
                    onGoToGameroomListener={onGoToGameroomListener}
                />
            </CardText>
        </Card>
    )
}
