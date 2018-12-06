import * as React from 'react'
import {
    withStyles,
    Card,
    Typography,
    CardContent,
    Grid,
    CardHeader
} from '@material-ui/core'
import styles from './styles'

class TransactionHistory extends React.Component {
    public render() {
        return (
            <Card>
                <CardHeader title="Transaction History" />
                <CardContent>
                    <Grid container={true} spacing={32}>
                        <Grid item={true} xs={12} sm={6}>
                            <Typography>Transaction History</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(TransactionHistory)
