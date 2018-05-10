import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import SpinHistoryItem from './SpinHistoryItem'

export default function spinHistory({ spinArray }) {
    return (
        <Card className="full-size card">
            <CardHeader title="Spin History" />
            <CardText>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Hash</th>
                            <th>Reel Hash</th>
                            <th>Reel Seed Hash</th>
                            <th>Reel</th>
                            <th>Payout</th>
                            <th>Valid?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {spinArray.map(spin => (
                            <SpinHistoryItem key={spin.nonce} spin={spin} />
                        ))}
                    </tbody>
                </table>
            </CardText>
        </Card>
    )
}
