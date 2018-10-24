import * as React from 'react'
import PublicAppBar from '../common/components/PublicAppBar'
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography
} from '@material-ui/core'

export default function PrivacyPolicy() {
    return (
        <React.Fragment>
            <PublicAppBar title="Privacy Policy" />
            <Card style={{ marginTop: '80px', marginBottom: '80px' }}>
                <CardHeader title="Privacy Policy" />
                <CardContent>
                    <Grid
                        container={true}
                        direction="row"
                        alignItems="flex-start"
                        justify="center"
                        spacing={24}
                    >
                        <Grid item={true} xs={12}>
                            <Typography variant="subheading" color="primary">
                                What is Lorem Ipsum?
                            </Typography>
                            <Typography align="justify">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen
                                book. It has survived not only five centuries,
                                but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was
                                popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages,
                                and more recently with desktop publishing
                                software like Aldus PageMaker including versions
                                of Lorem Ipsum
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Typography variant="subheading" color="primary">
                                What is Lorem Ipsum?
                            </Typography>
                            <Typography align="justify">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen
                                book. It has survived not only five centuries,
                                but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was
                                popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages,
                                and more recently with desktop publishing
                                software like Aldus PageMaker including versions
                                of Lorem Ipsum
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Typography variant="subheading" color="primary">
                                What is Lorem Ipsum?
                            </Typography>
                            <Typography align="justify">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen
                                book. It has survived not only five centuries,
                                but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was
                                popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages,
                                and more recently with desktop publishing
                                software like Aldus PageMaker including versions
                                of Lorem Ipsum
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Typography variant="subheading" color="primary">
                                What is Lorem Ipsum?
                            </Typography>
                            <Typography align="justify">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen
                                book. It has survived not only five centuries,
                                but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was
                                popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages,
                                and more recently with desktop publishing
                                software like Aldus PageMaker including versions
                                of Lorem Ipsum
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
