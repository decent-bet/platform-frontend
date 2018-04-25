import React from 'react'
import SlotChannelListItem from './SlotChannelListItem'

export default function SlotChannelListInner({
    stateChannels,
    onDepositToChannelListener,
    onGoToGameroomListener
}) {
    // Build the rows of the table
    let stateChannelList = []
    for (const id in stateChannels) {
        if (stateChannels.hasOwnProperty(id)) {
            const element = stateChannels[id]
            stateChannelList.push(
                <SlotChannelListItem
                    key={id}
                    id={id}
                    stateChannel={element}
                    onDepositToChannelListener={onDepositToChannelListener}
                    onGoToGameroomListener={onGoToGameroomListener}
                />
            )
        }
    }
    if (stateChannelList.length > 0) {
        // There is at least one row
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Deposit</th>
                        <th>Status</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>{stateChannelList}</tbody>
            </table>
        )
    } else {
        // There are no rows. Print a placeholder.
        return <h5 className="text-center">No channels available yet</h5>
    }
}
