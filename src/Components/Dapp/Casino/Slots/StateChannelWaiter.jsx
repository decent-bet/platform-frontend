import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default function StateChannelWaiter({
    builtChannelId,
    message = 'Building your state channel'
}) {
    return (
        <section>
            <Card className="card">
                <CardHeader title="Please wait" subtitle={message} />
                <CardText className="progress-text">
                    <FontAwesomeIcon icon="cog" spin className="fa-5x" />
                </CardText>
            </Card>
        </section>
    )
}
