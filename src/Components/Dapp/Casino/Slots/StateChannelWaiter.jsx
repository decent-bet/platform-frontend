import React from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function StateChannelWaiter({ message = null }) {
    return (
        <Card className="card">
            <CardHeader title="Loading" subtitle={message} />
            <CardContent className="progress-text">
                <Typography>
                    <FontAwesomeIcon icon="cog" spin className="fa-5x" />
                </Typography>
            </CardContent>
        </Card>
    )
}
