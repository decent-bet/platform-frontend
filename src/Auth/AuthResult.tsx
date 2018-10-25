import * as React from 'react'
import { Typography, Grid } from '@material-ui/core'

export interface IAuthResult {
    message: string
}

export default function AuthResult(props: IAuthResult) {
    return (
        <Grid container={true} direction="column" alignItems="center">
            <Grid
                item={true}
                xs={12}
                style={{
                    paddingTop: '2em',
                    paddingBottom: '1em'
                }}
            >
                <Typography variant="subheading" align="center">
                    {props.message}
                </Typography>
            </Grid>
        </Grid>
    )
}
