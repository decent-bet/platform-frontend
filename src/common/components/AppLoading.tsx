import * as React from 'react'
import { Grid, CircularProgress, Typography } from '@material-ui/core'

class AppLoading extends React.Component<any> {
    public render() {
        return (
            <Grid
                container={true}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ height: '60vh', width: '100%' }}
            >
                <Grid container={true} direction="column" alignItems="center">
                    <Grid item={true} xs={12}>
                        <CircularProgress />
                    </Grid>
                    {this.props.message ? (
                        <Grid item={true} xs={12}>
                            <Typography variant="headline" align="center">
                                {this.props.message}
                            </Typography>
                        </Grid>
                    ) : null}
                </Grid>
            </Grid>
        )
    }
}

export default AppLoading
