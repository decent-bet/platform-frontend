import * as React from 'react'
import {Grid, CircularProgress} from '@material-ui/core'

class AppLoading extends React.Component {

    public render() {
        return (
            <Grid
                container={true}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ height: '100vh' }}
            >
                <Grid container={true} direction="column" alignItems="center">
                    <Grid item={true} xs={12}>
                        <CircularProgress />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default AppLoading