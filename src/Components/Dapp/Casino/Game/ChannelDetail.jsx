import { Card, CardHeader, CardText } from 'material-ui'
import React from 'react'
import Helper from '../../../Helper'
import SpinHistory from './SpinHistory'

const helper = new Helper()

export default function channelDetail({
    initialDeposit,
    hashes,
    houseSpins,
    userHashes
}) {
    return (
        <Card className="card">
            <CardHeader
                actAsExpander={true}
                showExpandableButton={true}
                title="Data For Nerds"
            />
            <CardText expandable={true}>
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

            <CardHeader title="Spin History" expandable={true} />
            <CardText expandable={true}>
                <SpinHistory houseSpins={houseSpins} userHashes={userHashes} />
            </CardText>
        </Card>
    )
}
