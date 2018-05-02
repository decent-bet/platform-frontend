import React from 'react'
import SlotsGameCard from './SlotsGameCard'

export default function SlotsList({ builtChannelId, onGameSelectedListener }) {
    // If there is no channel, show nothing
    if (builtChannelId === '0x') return null

    return (
        <SlotsGameCard
            imageUrl="backgrounds/slots-crypto-chaos.png"
            onClickListener={onGameSelectedListener}
        />
    )
}
