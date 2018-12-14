import React, { Component, MouseEvent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import {
    withStyles,
    Card,
    CardContent,
    Grid,
    CardHeader,
    IconButton,
    Tooltip,
    Fab,
    CircularProgress,
    CardActions,
    Typography
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/RefreshRounded'
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded'
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
    public state: ITransactionHistoryState = DefaultState

    public async componentDidMount() {
        await this.loadTransactions()
    }

    private loadTransactions = async () => {
        this.setState({ currentIndex: 0 })
        await this.props.getChannelsHistory(this.props.vetAddress, 0)
    }

    private didClickOnRefresh = async (_event: MouseEvent) => {
        await this.loadTransactions()
    }

    private channelDetails = (channelId: string) => {
        const details = this.props.details[channelId]
        return details ? details : null
    }

    private didClickOnLoadMore = async (_event: MouseEvent) => {
        let { currentIndex } = this.state
        currentIndex = currentIndex + 10

        this.setState({ currentIndex })
        await this.props.getChannelsHistory(this.props.vetAddress, currentIndex)
    }

    public render() {
        const { channels, classes, isLoading, vetAddress } = this.props
        const { currentIndex } = this.state
        return (
            <Card>
                <CardHeader
                    title="Transaction History"
                    action={
                        <Tooltip title="Refresh">
                            <IconButton
                                disabled={isLoading}
                                onClick={this.didClickOnRefresh}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    }
                />
                <CardContent className={classes.root}>
                    <Grid container={true} spacing={40}>
                        <Grid item={true} xs={12}>
                            {isLoading && currentIndex === 0 ? (
                                <AppLoading />
                            ) : (
                                channels.map((channel, index) => (
                                    <ChannelHistoryItem
                                        getChannelDetails={
                                            this.props.getChannelDetails
                                        }
                                        channel={channel}
                                        details={this.channelDetails(
                                            channel.id
                                        )}
                                        vetAddress={vetAddress}
                                        key={index}
                                    />
                                ))
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions className={classes.toolbar}>
                    {isLoading && currentIndex > 0 ? (
                        <CircularProgress size={24} />
                    ) : null}

                    {this.props.itemsNotFound ? (
                        <Typography className={classes.moreAction} variant="h6">
                            No more items
                        </Typography>
                    ) : (
                        <Tooltip title="Load more">
                            <Fab
                                color="primary"
                                disabled={isLoading}
                                onClick={this.didClickOnLoadMore}
                                className={classes.moreAction}
                            >
                                <MoreHorizRoundedIcon
                                    className={classes.extendedIcon}
                                />
                            </Fab>
                        </Tooltip>
                    )}
                </CardActions>
            </Card>
        )
    }
}

const styledComponent = withStyles(styles)(TransactionHistory)

const mapStateToProps = state => {
    return { ...state.account.transactionHistory }
}

const mapDispatchToProps = function(dispatch) {
    return bindActionCreators({ ...thunks }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(styledComponent)
