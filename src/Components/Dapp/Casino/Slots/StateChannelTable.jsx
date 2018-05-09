import React from 'react'
import { Card, CardText, CardHeader } from 'material-ui'
import { units } from 'ethereum-units'
import BigNumber from 'bignumber.js'

function channelBalanceParser(channel) {
    let totalTokens = channel.info ? channel.info.initialDeposit : 0
    if (channel.houseSpins && channel.houseSpins.length > 0) {
        const lastIdx = channel.houseSpins.length - 1
        const rawBalance = channel.houseSpins[lastIdx].userBalance
        totalTokens = new BigNumber(rawBalance)
    }
    return totalTokens.dividedBy(units.ether).toFixed(2)
}

export default function StateChannelTable({ channelMap, children }) {
    // List all existing channels for this user
    const array = []
    for (const channelId in channelMap) {
        if (channelMap.hasOwnProperty(channelId)) {
            const channel = channelMap[channelId]

            const isClaimed =
                channel.info.finalized &&
                channel.deposited.isLessThanOrEqualTo(0)

            // Is channel still usable?
            if (channel.info.ready && channel.info.activated && !isClaimed) {
                // Parse the balance from the state
                let totalTokens = channelBalanceParser(channel)

                // Send the row
                array.push(
                    <tr key={channelId}>
                        <td>{totalTokens}</td>
                        <td>{channel.channelId}</td>
                        <td>{children(channel)}</td>
                    </tr>
                )
            }
        }
    }

    // If there are no rows, hide the table
    if (array.length <= 0) return null

    return (
        <Card className="card">
            <CardHeader title="Use an existing State Channel" />
            <CardText className="channel-table">
                <table>
                    <thead>
                        <tr>
                            <th>Deposited Tokens</th>
                            <th>Channel Id</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>{array}</tbody>
                </table>
            </CardText>
        </Card>
    )
}
