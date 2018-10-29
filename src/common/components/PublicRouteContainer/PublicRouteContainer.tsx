import * as React from 'react'

import logo from '../../../assets/img/dbet-white.svg'
import { withStyles } from '@material-ui/core'
import { Card, Grid, CardHeader, CardContent } from '@material-ui/core'
import TransparentPaper from '../TransparentPaper'
import IPublicRouteContainerProps from './IPublicRouteContainerProps'
import withWidth from '@material-ui/core/withWidth'
import styles from './styles'

class PublicRouteContainer extends React.Component<IPublicRouteContainerProps> {
    public render() {
        let cardWidth
        let alignItems
        switch (this.props.width) {
            case 'xs':
                cardWidth = '23rem'
                alignItems = 'flex-start'
                break
            case 'sm':
                cardWidth = '37rem'
                alignItems = 'flex-start'
                break
            case 'md':
            case 'lg':
            case 'xl':
                cardWidth = '37rem'
                alignItems = 'center'
                break
            default:
                cardWidth = '37rem'
                alignItems = 'center'
                break
        }

        return (
            <Grid
                container={true}
                className={this.props.classes.root}
                direction="column"
                alignItems="center"
                justify={alignItems}
            >
                <Grid item={true} xs={12} sm={4} md={4} xl={4}>
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
