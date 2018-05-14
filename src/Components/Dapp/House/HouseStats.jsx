import React, { Fragment } from 'react'
import { Card, CardHeader, CardText } from 'material-ui'

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
                <CardText>{currentSession} {currentSession === '0' && SESSION_ZERO_MESSAGE}</CardText>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Authorized Addresses" />
                <CardText>
                    <ul>
                        {authorizedAddresses.map((address, index) => (
                            <li key={index}>{address}</li>
                        ))}
                    </ul>
                </CardText>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Credits Available" />
                <CardText>
                    {availableCredits ? availableCredits : '0'} CREDITS
                </CardText>1
            </Card>
        </Fragment>
    )
}
