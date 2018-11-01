import * as React from 'react'
import { Button } from '@material-ui/core'
import * as moment from 'moment'
export default class StateChannelToolbar extends React.Component<any> {
    constructor(props: any) {
        super(props)
        this.onClaimListener = this.onClaimListener.bind(this)
    }

    private onClaimListener() {
        this.props.onClaimChannelListener(this.props.channel.channelId)
    }

    public render() {
        const { channel } = this.props
        let disabled

        if (channel && channel.info) {
            const endTime = parseInt(channel.info.endTime)
            let toCompare = moment.unix(endTime)
            // add 15 minutes and 10 seconds to the finalize datetime
            toCompare.add({ minutes: 15, seconds: 10 })
            const isValidTimeForClaim = moment().isAfter(toCompare)
            disabled =
                !channel.info.finalized ||
                channel.info.claimed ||
                !isValidTimeForClaim
        } else {
            disabled = true
        }

        return (
            <Button
                variant="contained"
                color="primary"
                onClick={this.onClaimListener}
                disabled={disabled}
            >
                Claim Chips
            </Button>
        )
    }
}
