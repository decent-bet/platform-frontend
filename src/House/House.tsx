import React, { Component } from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Paper,
    Typography
} from '@material-ui/core'

class House extends Component<{}, {}> {
    public render() {
        return (
            <Grid container={true} justify="center" direction="row">
                <Grid item={true} xs={12} md={8} lg={6}>
                    <Paper>
                        <Card>
                            <CardHeader
                                title="House Status"
                                subheader="Dolor sic amet"
                            />
                            <CardContent>
                                <Typography>
                                    Lorem Ipsum
                                    acjbasjkbajcbasjbasbcsajcbasjcbsakjcbsakcbasjcbsackjbasckjbaskcbasc
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default House
