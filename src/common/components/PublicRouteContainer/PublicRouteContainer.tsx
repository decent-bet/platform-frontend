import * as React from 'react'

import logo from '../../../assets/img/dbet-white.svg'
import { withStyles } from '@material-ui/core'
import { Card, Grid, CardHeader, CardContent } from '@material-ui/core'
import TransparentPaper from '../TransparentPaper'
import IPublicRouteContainerProps from './IPublicRouteContainerProps'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import styles from './styles'

class PublicRouteContainer extends React.Component<IPublicRouteContainerProps> {
    public render() {
        const cardWidth = isWidthUp('xs', this.props.width) ? '23rem' : '38rem'

        return (
            <Grid
                container={true}
                className={this.props.classes.root}
                direction="column"
                alignItems="center"
            >
                <Grid item={true} xs={12}>
                    <TransparentPaper>
                        <Card
                            className={this.props.classes.card}
                            style={{ width: cardWidth }}
                        >
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
const styledComponent = withStyles(styles)(PublicRouteContainer)
export default withWidth()(styledComponent)
