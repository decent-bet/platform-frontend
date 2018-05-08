import React, { Fragment } from 'react'
import SlotsGameCard from './SlotsGameCard'
import { Card } from 'material-ui'
import { units } from 'ethereum-units'
import BigNumber from 'bignumber.js'

export default function SlotsList({ stateChannel, onGameSelectedListener }) {

    // Get the channel balance
    let balance = stateChannel.info ? stateChannel.info.initialDeposit : 0
    if (stateChannel.houseSpins.length > 0) {
        const lastIdx = stateChannel.houseSpins.length - 1
        const lastHouseSpin = stateChannel.houseSpins[lastIdx]
        balance = new BigNumber(lastHouseSpin.userBalance)
    }
    balance = balance.dividedBy(units.ether).toFixed(2)

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
                onClickListener={onGameSelectedListener}
            />
        </Fragment>
    )
}
