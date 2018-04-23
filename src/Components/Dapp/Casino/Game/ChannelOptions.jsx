import React from 'react'
import { Card, FlatButton } from 'material-ui'
import { styles as Styles } from '../../../Base/styles'

const styles = Styles()

export default function ChannelOptions({
    onClaimListener,
    onFinalizeListener,
    isFinalized,
    isClosed,
    isClaimed
}) {
    let isClaimButtonDisabled = !isClosed || isClaimed
    return (
        <Card style={styles.card} className="p-4">
            <div className="row channel-options">
                <div className="col-12">
                    <h3 className="text-center text-uppercase mb-3">
                        Channel Options
                    </h3>
                </div>
                <div className="col-12 mt-3">
                    <p className="text-center">
                        To finalize a channel allowing you to withdraw your
                        DBETs, click on the 'Close Channel' button below
                    </p>
                </div>
                <div className="col-12">
                    <FlatButton
                        primary={true}
                        label="Close Channel"
                        disabled={isFinalized}
                        className="mx-auto d-block"
                        onClick={onFinalizeListener}
                    />
                </div>
                <div className="col-12 mt-3">
                    <p className="text-center">
                        After finalizing your channel and a time period of 1
                        minute, please click on the Claim DBETs button below to
                        claim your DBETs from the channel
                    </p>
                </div>
                <div className="col-12">
                    <FlatButton
                        primary={true}
                        label="Claim DBETs"
                        disabled={isClaimButtonDisabled}
                        className="mx-auto d-block"
                        onClick={onClaimListener}
                    />
                </div>
            </div>
        </Card>
    )
}
