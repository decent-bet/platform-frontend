import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import Helper from '../../../Helper'

const helper = new Helper()

export default function channelDetail({ initialDeposit, hashes }) {
    return (
        <Card className="card double-size">
            <CardHeader title="Channel Details" />
            <CardText>
                <dl>
                    <dt>Initial Deposit</dt>
                    <dd>{helper.formatEther(initialDeposit)} DBETs</dd>
                    <dt>Initial User Number</dt>
                    <dd>{hashes.initialUserNumber}</dd>
                    <dt>Final User Hash</dt>
                    <dd>{hashes.finalUserHash}</dd>
                    <dt>Final Reel Hash</dt>
                    <dd>{hashes.finalReelHash}</dd>
                    <dt>Final Seed Hash</dt>
                    <dd>{hashes.finalSeedHash}</dd>
                </dl>
            </CardText>
        </Card>
    )
}
