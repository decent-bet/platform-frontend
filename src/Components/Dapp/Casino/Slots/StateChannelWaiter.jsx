import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default function StateChannelWaiter({
    isBuildingChannel,
    builtChannelId
}) {
    // Only show the Progress Bar while the transaction is being processed
    if (!isBuildingChannel || builtChannelId !== '0x') {
        return null
    }

    return (
        <section>
            <Card className="card">
                <CardHeader
                    title="Please wait"
                    subtitle="Building your state channel"
                />
                <CardText className="progress-text">
                    <FontAwesomeIcon icon="cog" spin className="fa-5x" />
                </CardText>
            </Card>
        </section>
    )
}
