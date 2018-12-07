import * as React from 'react'
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

class TransactionHistory extends React.Component<
    ITransactionHistoryProps,
    ITransactionHistoryState
> {
    public state: Readonly<ITransactionHistoryState> = DefaultState

    public async componentDidMount() {
        await this.props.loadTransactions()
    }

    private didClickOnRefresh = async (_event: React.MouseEvent) => {
        await this.props.loadTransactions()
    }

    public render() {
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
                                <RefreshIcon color="secondary" />
                            </IconButton>
                        </Tooltip>
                    }
                />
                <CardContent>
                    <Grid container={true} spacing={32}>
                        <Grid item={true} xs={12} sm={6}>
                            {this.props.loading ? (
                                <AppLoading />
                            ) : (
                                <code
                                    style={{ overflow: 'auto', width: '100%' }}
                                >
                                    {JSON.stringify(this.props.transactions)}
                                </code>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(TransactionHistory)
