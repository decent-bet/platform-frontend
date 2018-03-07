import React from 'react'
import { Card, CardText, CardHeader } from 'material-ui'
import SlotChannelListInner from './SlotChannelListInner'

const styles = require('../../../Base/styles').styles()
styles.card.borderRadius = 15

export default function SlotChannelList({
    stateChannels,
    onDepositToChannelListener
}) {
    return (
        <Card className="channel-list-card" style={styles.card}>
            <CardHeader title="Open Channels" />
            <CardText>
                <small className="text-white">
                    <span className="text-gold font-weight-bold">
                        Decent.bet{' '}
                    </span>
                    relies on "State Channels" to ensure casino users can enjoy
                    lightning fast games while still being secured by smart
                    contracts on the blockchain. Listed below are channels
                    created from your current address which can be continued or
                    closed at any point in time.
                </small>

                <SlotChannelListInner
                    stateChannels={stateChannels}
                    onDepositToChannelListener={onDepositToChannelListener}
                />
            </CardText>
        </Card>
    )
}
