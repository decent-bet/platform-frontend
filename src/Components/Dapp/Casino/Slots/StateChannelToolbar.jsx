import React, { Component, Fragment } from 'react'
import { RaisedButton } from 'material-ui'

export default class StateChannelToolbar extends Component {
    onClaimListener = () =>
        this.props.onClaimChannelListener(this.props.channel.channelId)

    onSelectListener = () =>
        this.props.onSelectChannelListener(this.props.channel.channelId)

    render() {
        const { channel } = this.props
        return (
            <Fragment>
                <RaisedButton
                    label="Use"
                    primary={true}
                    onClick={this.onSelectListener}
                    disabled={channel.info.finalized}
                />
                <RaisedButton
                    label="Claim Tokens"
                    primary={true}
                    onClick={this.onClaimListener}
                    disabled={!channel.info.finalized || channel.info.claimed}
                />
            </Fragment>
        )
    }
}
