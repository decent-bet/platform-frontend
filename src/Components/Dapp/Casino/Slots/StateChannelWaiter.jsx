import React from 'react'
import { Card, CardHeader, CardContent } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default function StateChannelWaiter({ builtChannelId, message = null }) {
    return (
        <Card className="card">
            <CardHeader title="Loading" subtitle={message} />
            <CardContent className="progress-text">
                <FontAwesomeIcon icon="cog" spin className="fa-5x" />
            </CardContent>
        </Card>
    )
}
