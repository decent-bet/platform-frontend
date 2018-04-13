import React from 'react'
import { Card } from 'material-ui'
import SpinHistoryItem from './SpinHistoryItem'

const styles = require('../../../Base/styles').styles()

export default function spinHistory({ spinArray }) {
    return (
        <Card style={styles.card} className="p-4">
            <section>
                <h3 className="text-center text-uppercase mb-3">
                    Spin History
                </h3>
                <table className="table table-striped table-responsive">
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
            </section>
        </Card>
    )
}
