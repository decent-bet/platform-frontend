import React, { Fragment } from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'

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
                <CardContent>
                    <Typography component="p">
                        {currentSession}{' '}
                        {currentSession === '0' && SESSION_ZERO_MESSAGE}
                    </Typography>
                </CardContent>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Authorized Addresses" />
                <CardContent>
                    {authorizedAddresses.map((address, index) => (
                        <Typography
                            component="p"
                            key={index}
                            style={{ wordBreak: 'break-word' }}
                        >
                            {address}
                        </Typography>
                    ))}
                </CardContent>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Credits Available" />
                <CardContent>
                    <Typography component="p">
                        {availableCredits ? availableCredits : '0'} CREDITS
                    </Typography>
                </CardContent>
            </Card>
        </Fragment>
    )
}
