import React from 'react'
import { Card } from 'material-ui'
import Helper from '../../../Helper'

const styles = require('../../../Base/styles').styles()
const helper = new Helper()

export default function channelDetail({ initialDeposit, hashes }) {
    return (
        <Card style={styles.card} className="p-4">
            <section className="channel-details">
                <h3 className="text-center text-uppercase mb-3">
                    Channel Details
                </h3>
                <div className="row mt-4">
                    <div className="col-6">
                        <h5>Initial Deposit</h5>
                        <p>{helper.formatEther(initialDeposit)} DBETs</p>
                    </div>
                    <div className="col-6">
                        <h5>Initial User Number</h5>
                        <p>{hashes.initialUserNumber}</p>
                    </div>
                    <div className="col-6">
                        <h5>Final User Hash</h5>
                        <p>{hashes.finalUserHash}</p>
                    </div>
                    <div className="col-6">
                        <h5>Final Reel Hash</h5>
                        <p>{hashes.finalReelHash}</p>
                    </div>
                    <div className="col-6">
                        <h5>Final Seed Hash</h5>
                        <p>{hashes.finalSeedHash}</p>
                    </div>
                </div>
            </section>
        </Card>
    )
}
