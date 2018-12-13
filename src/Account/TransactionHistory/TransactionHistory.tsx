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
    CardActions
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/RefreshRounded'
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded'
import styles from './styles'
import ITransactionHistoryProps from './ITransactionHistoryProps'
import ITransactionHistoryState from './ITransactionHistoryState'
import TransactionHistoryState from './TransactionHistoryState'
import AppLoading from '../../common/components/AppLoading'
import ChannelHistoryItem from './ChannelHistoryItem'

class TransactionHistory extends Component<
    ITransactionHistoryProps,
    ITransactionHistoryState
> {
    public state: ITransactionHistoryState = new TransactionHistoryState()

    public async componentDidMount() {
        this.setState({ isLoading: true })
        await this.loadTransactions()
        this.setState({ isLoading: false })
    }

    private loadTransactions = async (currentIndex?: number) => {
        currentIndex = currentIndex ? currentIndex : 0
        await this.props.getChannelsHistory(this.props.vetAddress, currentIndex)
    }

    private didClickOnRefresh = async (_event: MouseEvent) => {
        this.setState({ isLoading: true })
        await this.loadTransactions()
        this.setState({ isLoading: false })
    }

    private didClickOnLoadMore = async (_event: MouseEvent) => {
        this.setState({ isLoadingMore: true })
        await this.loadTransactions(this.state.currentIndex)
        this.setState({ isLoadingMore: false })
        this.setState({ currentIndex: this.state.currentIndex + 10 })
    }

    public render() {
        const { channels, classes } = this.props
        return (
            <Card>
                <CardHeader
                    title="Transaction History"
                    action={
                        <Tooltip title="Refresh">
                            <IconButton
                                disabled={this.state.isLoading}
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
                            {this.state.isLoading ? (
                                <AppLoading />
                            ) : (
                                channels.map((channel, index) => (
                                    <ChannelHistoryItem
                                        channel={channel}
                                        key={index}
                                    />
                                ))
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions className={classes.toolbar}>
                    {this.state.isLoadingMore ? (
                        <CircularProgress size={24} />
                    ) : null}
                    <Tooltip title="Load more">
                        <Fab
                            color="primary"
                            disabled={
                                this.state.isLoading || this.state.isLoadingMore
                            }
                            onClick={this.didClickOnLoadMore}
                            className={classes.fab}
                        >
                            <MoreHorizRoundedIcon
                                className={classes.extendedIcon}
                            />
                        </Fab>
                    </Tooltip>
                </CardActions>
            </Card>
        )
    }
}

const styledComponent = withStyles(styles)(TransactionHistory)

const mapStateToProps = state => {
    const { transactionHistory } = state.account
    return transactionHistory
}

const mapDispatchToProps = function(dispatch) {
    return bindActionCreators({ ...thunks }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(styledComponent)
