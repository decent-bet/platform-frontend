import * as React from 'react'

import logo from '../../../assets/img/dbet-white.svg'
import { withStyles } from '@material-ui/core'
import { Card, Grid, CardHeader, CardContent } from '@material-ui/core'
import TransparentPaper from '../TransparentPaper'
import IPublicRouteContainerProps from './IPublicRouteContainerProps'
import styles from './styles'

class PublicRouteContainer extends React.Component<IPublicRouteContainerProps> {
    public render() {
        return (
            <Grid
                container={true}
                className={this.props.classes.root}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid
                    item={true}
                    xs={12}
                    sm={5}
                    md={5}
                    className={this.props.classes.grid}
                >
                    <TransparentPaper>
                        <Card className={this.props.classes.card}>
                            <CardHeader
                                avatar={
                                    <img
                                        src={logo}
                                        alt="Decent.bet Logo"
                                        style={{ maxHeight: 26 }}
                                    />
                                }
                            />
                            <CardContent>{this.props.children}</CardContent>
                        </Card>
                    </TransparentPaper>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(PublicRouteContainer)
