import * as React from 'react'
import {
    withStyles,
    Card,
    CardContent,
    Grid,
    CardHeader
} from '@material-ui/core'
import styles from './styles'
import ITransactionHistoryProps from './ITransactionHistoryProps'
import ITransactionHistoryState from './ITransactionHistoryState'
import TransactionHistoryState from './TransactionHistoryState'
import AppLoading from 'src/common/components/AppLoading'

class TransactionHistory extends React.Component<
    ITransactionHistoryProps,
    ITransactionHistoryState
> {
    constructor(props: ITransactionHistoryProps) {
        super(props)
        this.state = new TransactionHistoryState()
    }

    public async componentDidMount() {
        await this.props.loadTransactions()
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Transaction History" />
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
