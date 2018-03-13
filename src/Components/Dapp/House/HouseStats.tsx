import * as React from 'react'
import { Card } from 'material-ui'

const styles = require('../../Base/styles').styles()

export interface HouseStatsProps {
    currentSession: number
    authorizedAddresses: string[]
    availableCredits: string
}

export default function HouseStats(props: HouseStatsProps) {
    let { currentSession, authorizedAddresses, availableCredits } = props
    return (
        <>
            <div className="col-4 text-center hvr-float">
                <Card style={styles.card}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="header">Current Session</h4>
                                <h4 className="stat mt-3">{currentSession}</h4>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="col-4 text-center hvr-float">
                <Card style={styles.card}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="header mb-2">
                                    Authorized Addresses
                                </h4>
                                {authorizedAddresses.map((address, index) => (
                                    <p
                                        className="stat mt-3 address"
                                        key={index}
                                    >
                                        {address}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="col-4 text-center hvr-float">
                <Card style={styles.card}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="header">Credits Available</h4>
                                <h4 className="stat mt-3">
                                    {availableCredits ? availableCredits : '0'}{' '}
                                    CREDITS
                                </h4>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}
