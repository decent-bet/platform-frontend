import * as React from 'react'
import { Button } from '@material-ui/core'
import * as moment from 'moment'
export default class StateChannelToolbar extends React.Component<any, any> {
    private _claimInterval: NodeJS.Timeout

    constructor(props: any) {
        super(props)
        this.state = {
            endTime: null,
            enableClaim: false
        }
        this.onClaimListener = this.onClaimListener.bind(this)
    }

    public componentDidMount() {
        if (this.isChannelClaimable) {
            if (this.isChannelClaimable) {
                const sourceEndtime = parseInt(this.props.channel.info.endTime)
                let endTime = moment.unix(sourceEndtime)
                // add 10 seconds to the finalize datetime
                endTime.add({ seconds: 10 })
                this.setState({ endTime })

                if (moment().isAfter(endTime)) {
                    this.setState({ enabledClaim: true })
                } else {
                    this._claimInterval = setInterval(() => {
                        if (moment().isAfter(endTime)) {
                            clearInterval(this._claimInterval)
                            this.setState({ enabledClaim: true })
                        }
                    }, 3000)
                }
            }
        } else {
            this.setState({ endTime: null })
        }
    }

    private get isChannelClaimable(): boolean {
        const { channel } = this.props
        if (
            channel &&
            channel.info &&
            channel.info.finalized &&
            !channel.info.claimed
        ) {
            return true
        }
        return false
    }

    public componentWillUnmount() {
        if (this._claimInterval) {
            clearInterval(this._claimInterval)
        }
    }

    private onClaimListener() {
        this.props.onClaimChannelListener(this.props.channel.channelId)
    }

    public render() {
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={this.onClaimListener}
                disabled={!this.state.enabledClaim}
            >
                Claim Chips
            </Button>
        )
    }
}
