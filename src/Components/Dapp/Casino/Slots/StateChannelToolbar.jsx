import React, { Component } from 'react'
import { Button } from '@material-ui/core'

export default class StateChannelToolbar extends Component {
    onClaimListener = () =>
        this.props.onClaimChannelListener(this.props.channel.channelId)

    render() {
        const { channel } = this.props
        const disabled = channel && channel.info ? (!channel.info.finalized || channel.info.claimed) : true 
        return (
            <Button
                variant="raised"
                color="primary"
                onClick={this.onClaimListener}
                disabled={disabled}
            >
                Claim Chips
            </Button>
        )
    }
}
