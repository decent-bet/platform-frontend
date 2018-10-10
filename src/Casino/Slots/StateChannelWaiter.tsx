import * as React from 'react'
import { Typography, CircularProgress, Grid } from '@material-ui/core'

export default function StateChannelWaiter({ message = null }) {
    return (
        <Grid
        container={true}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ height: '100%', width: '100%' }}
    >
        <Grid container={true} direction="column" alignItems="center">
            <Grid item={true} xs={12}>
            <Typography component="div">
                    <CircularProgress color="secondary"/>
                </Typography>
            </Grid>
            <Grid item={true} xs={12}>
                <Typography variant="display4">
                    {message}
                </Typography>
            </Grid>
        </Grid>
    </Grid>
    )
}
