import React from 'react'
import { Card } from 'material-ui'
import SlotChannelListItem from './SlotChannelListItem'

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
                        <table className="table table-striped mt-4">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Deposit</th>
                                    <th>Status</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            {Object.keys(stateChannels).length > 0 && (
                                <tbody>
                                    {Object.keys(stateChannels).map(id => {
                                        if (stateChannels.hasOwnProperty(id)) {
                                            let channel = stateChannels[id]
                                            return (
                                                <SlotChannelListItem
                                                    key={id}
                                                    id={id}
                                                    stateChannel={channel}
                                                    onDepositToChannelListener={
                                                        onDepositToChannelListener
                                                    }
                                                />
                                            )
                                        } else {
                                            return <span />
                                        }
                                    })}
                                </tbody>
                            )}
                        </table>
                        {Object.keys(stateChannels).length === 0 && (
                            <div className="row">
                                <div className="col">
                                    <h5 className="text-center text-uppercase">
                                        No channels available yet..
                                    </h5>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Card>
    )
}
