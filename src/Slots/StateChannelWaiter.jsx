import React from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'

export default function StateChannelWaiter({ message = null }) {
    return (
        <Card className="card">
            <CardHeader title="Loading" subheader={message} />
            <CardContent className="progress-text">
                <Typography>
                    <CircularProgress color="secundary"/>
                </Typography>
            </CardContent>
        </Card>
    )
}
