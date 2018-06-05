import React from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button
} from '@material-ui/core'

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
            <CardContent className="card-text">
                <p>
                    To finalize a channel allowing you to withdraw your DBETs,
                    click on the 'Close Channel' button below
                </p>

                <p>
                    After finalizing your channel and a time period of 1 minute,
                    please click on the Claim DBETs button below to claim your
                    DBETs from the channel
                </p>
            </CardContent>

            <CardActions className="card-actions">
                <Button
                    variant="raised"
                    primary={true}
                    disabled={isFinalized}
                    onClick={onFinalizeListener}
                >
                    Close Channel
                </Button>

                <Button
                    variant="raised"
                    primary={true}
                    disabled={isClaimButtonDisabled}
                    onClick={onClaimListener}
                >
                    Claim DBETs
                </Button>
            </CardActions>
        </Card>
    )
}
