import React, { Component } from 'react'
import { Grid, Paper } from '@material-ui/core'
import HouseBalanceCard from './HouseBalanceCard'
import BigNumber from 'bignumber.js'

class House extends Component<{}, {}> {
    public render() {
        const balance = new BigNumber(0)
        return (
            <Grid container={true} justify="center" direction="row">
                <Grid item={true} xs={12} md={8} lg={6}>
                    <Paper>
                        <HouseBalanceCard balance={balance} />
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default House
