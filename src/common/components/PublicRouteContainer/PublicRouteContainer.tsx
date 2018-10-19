import * as React from 'react'

import logo from '../../../assets/img/dbet-white.svg'
import { withStyles } from '@material-ui/core'
import { Card, Grid, CardHeader } from '@material-ui/core'
import IPublicRouteContainerProps from './IPublicRouteContainerProps'
import styles from './styles'

class PublicRouteContainer<IPublicRouteContainerProps> extends React.Component {
    constructor(props: IPublicRouteContainerProps) {
        super(props)
    }

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
                        {this.props.children}
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(PublicRouteContainer)
