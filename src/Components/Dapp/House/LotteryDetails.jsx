import React from 'react'
import { Card, CardHeader, CardContent } from '@material-ui/core'

const styles = require('../../Base/styles').styles()

/**
 * Prints all the Lottery details in a Card
 * @param {Lottery} lottery Current Lotery
 */
export default function LotteryDetails({ lottery }) {
    let inner = ''
    if (lottery) {
        inner = (
            <table className="card-table">
                <tbody>
                    <tr>
                        <th>Tickets Sold</th>
                        <td>{lottery.ticketCount} tickets</td>
                    </tr>
                    <tr>
                        <th>Payout</th>
                        <td>{lottery.payout} DBETs</td>
                    </tr>
                    <tr>
                        <th>Winner Announced</th>
                        <td>
                            {lottery.finalized ? (
                                <span className="text-success">YES</span>
                            ) : (
                                <span className="text-danger">NO</span>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
    return (
        <Card className="hvr-float" style={styles.card}>
            <CardHeader title="Statistics" />
            <CardContent>{inner}</CardContent>
        </Card>
    )
}
