import React from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NoTokensWarning() {
    return (
        <main className="container">
            <Card className="card">
                <CardHeader title="No DBET Tokens Available in this Wallet" />
                <CardContent>
                    <Typography>
                        <FontAwesomeIcon
                            icon="exclamation-triangle"
                            className="fa-5x"
                        />
                    </Typography>
                </CardContent>
            </Card>
        </main>
    )
}
