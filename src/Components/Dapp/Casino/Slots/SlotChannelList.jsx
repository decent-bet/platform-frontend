import React from 'react'
import { Card } from 'material-ui'
import SlotChannelListInner from './SlotChannelListInner'

const styles = require('../../../Base/styles').styles()
styles.card.padding = 0
styles.card.borderRadius = 15

export default function SlotChannelList({
    stateChannels,
    onDepositToChannelListener
}) {
    return (
        <Card style={styles.card} className="p-4">
            <section>
                <h3 className="text-center text-uppercase mb-3">
                    Open channels
                </h3>
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
                <div className="row">
                    <div className="col">
                        <SlotChannelListInner
                            stateChannels={stateChannels}
                            onDepositToChannelListener={onDepositToChannelListener}
                        />
                    </div>
                </div>
            </section>
        </Card>
    )
}
