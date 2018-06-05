import React, { Fragment } from 'react'
import { Card, CardHeader, CardContent } from '@material-ui/core'

const styles = require('../../Base/styles').styles()

export default function HouseStats({
    currentSession,
    authorizedAddresses,
    availableCredits
}) {
    const SESSION_ZERO_MESSAGE = '(Displaying stats for session 1)'
    return (
        <Fragment>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Current Session" />
                <CardContent>{currentSession} {currentSession === '0' && SESSION_ZERO_MESSAGE}</CardContent>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Authorized Addresses" />
                <CardContent>
                    <ul>
                        {authorizedAddresses.map((address, index) => (
                            <li key={index}>{address}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Credits Available" />
                <CardContent>
                    {availableCredits ? availableCredits : '0'} CREDITS
                </CardContent>1
            </Card>
        </Fragment>
    )
}
