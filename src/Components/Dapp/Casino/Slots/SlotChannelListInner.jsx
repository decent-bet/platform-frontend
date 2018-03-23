import React from 'react'
import SlotChannelListItem from './SlotChannelListItem'

export default function SlotChannelListInner({
    stateChannels,
    onDepositToChannelListener,
    onGoToGameroomListener
}) {
    let stateChannelList = Object.keys(stateChannels)
    if (stateChannelList.length > 0) {
        return (
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Deposit</th>
                        <th>Status</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {stateChannelList.map(id => {
                        // Iterate Through all available state channels
                        // and print them as a Table Row
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
                                    onGoToGameroomListener={onGoToGameroomListener}
                                />
                            )
                        } else {
                            return <span />
                        }
                    })}
                </tbody>
            </table>
        )
    } else {
        return (
            <h5 className="text-center">
                No channels available yet
            </h5>
        )
    }
}
