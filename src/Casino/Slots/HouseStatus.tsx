import React, { FunctionComponent } from 'react'
import {
    Card,
    CardHeader,
    createStyles,
    Typography,
    WithStyles,
    withStyles,
    CardContent
} from '@material-ui/core'
import BigNumber from 'bignumber.js'

const styles = createStyles({
    accentCard: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'space-between'
    }
})

interface IHouseStatusProps {
    balance: BigNumber
}

const HouseStatus: FunctionComponent<
    IHouseStatusProps & WithStyles<typeof styles>
> = ({ classes, balance }) => (
    <Card className={classes.accentCard}>
        <CardHeader title="House Balance" />
        <CardContent>
            <Typography variant="h6">{`${balance.toString()} DBETs`}</Typography>
        </CardContent>
    </Card>
)

export default withStyles(styles)(HouseStatus)
