import React from 'react'
import {
    Card,
    CardHeader,
    CardText,
    CardActions,
    RaisedButton
} from 'material-ui'

export default function ChannelOptions({
    onClaimListener,
    onFinalizeListener,
    isFinalized,
    isClosed,
    isClaimed
}) {
    let isClaimButtonDisabled = !isClosed || isClaimed
    return (
        <Card className="card channel-options">
            <CardHeader title="Channel Options" />
            <CardText className="card-text">
                <p>
                    To finalize a channel allowing you to withdraw your DBETs,
                    click on the 'Close Channel' button below
                </p>

                <p>
                    After finalizing your channel and a time period of 1 minute,
                    please click on the Claim DBETs button below to claim your
                    DBETs from the channel
                </p>
            </CardText>

            <CardActions className="card-actions">
                <RaisedButton
                    primary={true}
                    label="Close Channel"
                    disabled={isFinalized}
                    onClick={onFinalizeListener}
                />

                <RaisedButton
                    primary={true}
                    label="Claim DBETs"
                    disabled={isClaimButtonDisabled}
                    onClick={onClaimListener}
                />
            </CardActions>
        </Card>
    )
}
