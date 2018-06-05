import React, { Component } from 'react'
import { Button } from '@material-ui/core'

export default class StateChannelToolbar extends Component {
    onClaimListener = () =>
        this.props.onClaimChannelListener(this.props.channel.channelId)

    render() {
        const { channel } = this.props
        return (
            <Button
                variant="raised"
                primary={true}
                onClick={this.onClaimListener}
                disabled={!channel.info.finalized || channel.info.claimed}
            >
                Claim Chips
            </Button>
        )
    }
}
