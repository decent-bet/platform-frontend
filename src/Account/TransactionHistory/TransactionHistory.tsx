import React, { Component, MouseEvent } from 'react'
import {
    withStyles,
    Card,
    CardContent,
    Grid,
    CardHeader,
    IconButton,
    Tooltip
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/RefreshRounded'
import styles from './styles'
import ITransactionHistoryProps from './ITransactionHistoryProps'
import {
    ITransactionHistoryState,
    DefaultState
} from './TransactionHistoryState'
import AppLoading from '../../common/components/AppLoading'
import ChannelHistoryItem from './ChannelHistoryItem'

class TransactionHistory extends Component<
    ITransactionHistoryProps,
    ITransactionHistoryState
> {
    public state: Readonly<ITransactionHistoryState> = DefaultState

    public async componentDidMount() {
        await this.props.loadTransactions()
    }

    private didClickOnRefresh = async (_event: MouseEvent) => {
        await this.props.loadTransactions()
    }

    public render() {
        const { channels } = this.props
        return (
            <Card>
                <CardHeader
                    title="Transaction History"
                    action={
                        <Tooltip title="Refresh">
                            <IconButton
                                disabled={this.props.loading}
                                onClick={this.didClickOnRefresh}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    }
                />
                <CardContent>
                    <Grid container={true} spacing={40}>
                        <Grid item={true} xs={12}>
                            {this.props.loading ? (
                                <AppLoading />
                            ) : (
                                channels.map(channel => (
                                    <ChannelHistoryItem
                                        channel={channel}
                                        key={channel.id}
                                    />
                                ))
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(TransactionHistory)
