import React, { Fragment } from 'react'
import SlotsGameCard from './SlotsGameCard'
import { Card, CardContent } from '@material-ui/core'
import { channelBalanceParser } from '../functions'

export default function SlotsList({ stateChannel, onGameSelectedListener }) {
    // Get the channel balance
    const balance = channelBalanceParser(stateChannel)

    return (
        <Fragment>
            <Card className="channel-description card">
                <CardContent component="header">{balance} DBETs</CardContent>
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
                imageUrl="backgrounds/slots-egyptian-treasures.jpg"
                onGameSelectedListener={onGameSelectedListener}
                gameName="egyptian-treasures"
            />
            <SlotsGameCard
                imageUrl="backgrounds/slots-crypto-chaos.png"
                onGameSelectedListener={onGameSelectedListener}
                gameName="crypto-chaos"
            />
        </Fragment>
    )
}
