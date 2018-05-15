import React, { Component } from 'react'
import { RaisedButton } from 'material-ui'

export default class StateChannelToolbar extends Component {
    onClaimListener = () =>
        this.props.onClaimChannelListener(this.props.channel.channelId)

    render() {
        const { channel } = this.props
        return (
            <RaisedButton
                label="Claim Chips"
                primary={true}
                onClick={this.onClaimListener}
                disabled={!channel.info.finalized || channel.info.claimed}
            />
        )
    }
}
