import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import LotteryTicketsList from './LotteryTicketsList'

const styles = require('../../Base/styles').styles()

/**
 * Lists all the current Lottery Tickets for this wallet.
 * @param {Lottery} lottery Current Lottery
 */
export default function LotteryTicketsCard({ lottery }) {
    return (
        <Card className="hvr-float" style={styles.card}>
            <CardHeader title="Your Tickets" />
            <CardText>
                <LotteryTicketsList lottery={lottery} />
            </CardText>
        </Card>
    )
}
