import React, { Fragment } from 'react'
import SlotsGameCard from './SlotsGameCard'
import { Card, CardHeader, CardText } from 'material-ui'
import { channelBalanceParser } from '../functions'

export default function SlotsList({ stateChannel, onGameSelectedListener }) {
    // Get the channel balance
    const balance = channelBalanceParser(stateChannel)

    return (
        <Fragment>
            <Card className="channel-description card">
                <CardHeader
                    actAsExpander={true}
                    showExpandableButton={true}
                    className="header"
                >
                    <div className="balance">
                        <span>{balance} DBETs</span>
                    </div>
                </CardHeader>
                <CardText expandable={true}>
                    <p>ID: {stateChannel.channelId}</p>
                </CardText>
            </Card>
            <SlotsGameCard
                imageUrl="backgrounds/slots-mythsmagic.jpg"
                onGameSelectedListener={onGameSelectedListener}
                gameName="mythsmagic"
            />
            <SlotsGameCard
                imageUrl="backgrounds/slots-classic-7even.jpg"
                onGameSelectedListener={onGameSelectedListener}
                gameName="classic-7even"
            />
            <SlotsGameCard
                imageUrl="backgrounds/slots-monster-mayhem.jpg"
                onGameSelectedListener={onGameSelectedListener}
                gameName="monster-mayhem"
            />
            <SlotsGameCard
                imageUrl="backgrounds/slots-mount-crypto.jpg"
                onGameSelectedListener={onGameSelectedListener}
                gameName="mount-crypto"
            />
            <SlotsGameCard
                imageUrl="backgrounds/slots-shiprekt.jpg"
                onGameSelectedListener={onGameSelectedListener}
                gameName="shiprekt"
            />
            <SlotsGameCard
                imageUrl="backgrounds/slots-spaceman.jpg"
                onGameSelectedListener={onGameSelectedListener}
                gameName="spaceman"
            />
            <SlotsGameCard
                imageUrl="backgrounds/slots-crypto-chaos.png"
                onGameSelectedListener={onGameSelectedListener}
                gameName="crypto-chaos"
            />
        </Fragment>
    )
}
