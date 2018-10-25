import React from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'

export default function NoTokensWarning() {
    return (
        <main className="container">
            <Card className="card">
                <CardHeader title="No DBET Tokens Available in this Wallet" />
                <CardContent>
                    <Typography>
                        <WarningIcon/>
                    </Typography>
                </CardContent>
            </Card>
        </main>
    )
}
