import React from 'react'
import { Card, CardText, CardHeader } from 'material-ui'
import { units } from 'ethereum-units'
import BigNumber from 'bignumber.js'

export default function StateChannelTable({ channelMap }) {
    // List all existing channels for this user
    const array = []
    for (const channelId in channelMap) {
        if (channelMap.hasOwnProperty(channelId)) {
            const channel = channelMap[channelId]

            // Is channel still usable?
            if (
                channel.info.ready &&
                channel.info.activated &&
                !channel.info.finalized
            ) {
                // Parse the balance from the state
                let totalTokens = channel.info ? channel.info.initialDeposit : 0
                if (channel.houseSpins && channel.houseSpins.length > 0) {
                    const penultimate = channel.houseSpins.length - 1
                    const rawBalance =
                        channel.houseSpins[penultimate].userBalance
                    totalTokens = new BigNumber(rawBalance)
                }
                totalTokens = totalTokens.dividedBy(units.ether).toFixed(2)

                // Send the row
                array.push(
                    <tr key={channelId}>
                        <td>{channel.channelId}</td>
                        <td>{totalTokens}</td>
                    </tr>
                )
            }
        }
    }

    // If there are no rows, hide the table
    if (array.length <= 0) return null

    return (
        <section>
            <Card className="card">
                <CardHeader title="Existing Channels" />
                <CardText>
                    <table className="table">
                        <tbody>{array}</tbody>
                    </table>
                </CardText>
            </Card>
        </section>
    )
}
