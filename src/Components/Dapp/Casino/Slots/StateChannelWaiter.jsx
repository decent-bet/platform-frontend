import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default function StateChannelWaiter({ builtChannelId }) {
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
