import * as React from 'react'
import { Card } from 'material-ui'

const styles = require('../../Base/styles').styles()

export interface LotteryDetailsProps {
    lottery: any
}

/**
 * Prints all the Lottery details in a Card
 * @param {Lottery} lottery Current Lotery
 */
export default function LotteryDetails(props: LotteryDetailsProps) {
    let { lottery } = props
    let inner: React.ReactElement<any> = <span />
    if (lottery) {
        inner = (
            <div className="col-12 mt-4 statistics">
                <div className="row">
                    <div className="col-6">
                        <span className="stat float-left">
                            TICKETS SOLD&ensp;
                        </span>
                    </div>
                    <div className="col-6">
                        <span className="float-right text-white">
                            {lottery.ticketCount} TICKETS
                        </span>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-6">
                        <span className="stat float-left">PAYOUT&ensp;</span>
                    </div>
                    <div className="col-6">
                        <span className="float-right text-white">
                            {lottery.payout} DBETS
                        </span>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-6">
                        <span className="stat float-left">
                            WINNER ANNOUNCED&ensp;
                        </span>
                    </div>
                    <div className="col-6">
                        <span className="float-right text-white">
                            {lottery.finalized ? (
                                <span className="text-success">YES</span>
                            ) : (
                                <span className="text-danger">NO</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Card style={styles.card}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h4 className="header mb-2">STATISTICS</h4>
                    </div>

                    {inner}
                </div>
            </div>
        </Card>
    )
}
