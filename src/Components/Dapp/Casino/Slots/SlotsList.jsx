import React, { Fragment } from 'react'
import SlotsGameCard from './SlotsGameCard'
import { Card } from 'material-ui'
import { channelBalanceParser } from '../functions'

export default function SlotsList({ stateChannel, onGameSelectedListener }) {
    // Get the channel balance
    const balance = channelBalanceParser(stateChannel)

    return (
        <Fragment>
            <Card className="channel-description card">
                <div className="balance">
                    <span>{balance} DBETs</span>
                </div>
                <div className="channel-id">
                    <span>ID: {stateChannel.channelId}</span>
                </div>
            </Card>
            <SlotsGameCard
                imageUrl="backgrounds/slots-crypto-chaos.png"
                onGameSelectedListener={onGameSelectedListener}
                gameName="game"
            />
            <SlotsGameCard
                imageUrl=""
                onGameSelectedListener={onGameSelectedListener}
                gameName="mythsmagic"
            />
        </Fragment>
    )
}
