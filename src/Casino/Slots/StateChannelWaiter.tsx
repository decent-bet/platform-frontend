import * as React from 'react'
import { Typography, CircularProgress, Grid } from '@material-ui/core'

export default function StateChannelWaiter({ message = null }) {
    return (
        <Grid
            container={true}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ width: '100%' }}
            spacing={24}
        >
            <Grid item={true} xs={12}>
                <CircularProgress />
            </Grid>
            <Grid item={true} xs={12}>
                <Typography variant="headline">{message}</Typography>
            </Grid>
        </Grid>
    )
}
