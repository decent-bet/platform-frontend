import * as React from 'react'
import { Card } from 'material-ui'
import LotteryTicketsList, { LotteryTicketsProps } from './LotteryTicketsList'

const styles = require('../../Base/styles').styles()

/**
 * Lists all the current Lottery Tickets for this wallet.
 * @param {Lottery} lottery Current Lottery
 */
export default function LotteryTicketsCard(props: LotteryTicketsProps) {
    return (
        <Card style={styles.card}>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4 className="header mb-2">YOUR TICKETS</h4>
                        <LotteryTicketsList lottery={props.lottery} />
                    </div>
                </div>
            </div>
        </Card>
    )
}
