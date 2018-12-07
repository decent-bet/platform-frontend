import React, { FunctionComponent } from 'react'
import {
    Card,
    CardHeader,
    createStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    WithStyles,
    withStyles,
    CardContent
} from '@material-ui/core'
import { AccountBalanceWallet } from '@material-ui/icons'
import BigNumber from 'bignumber.js'
import { displayWeiToETH } from './common/functions'

const styles = createStyles({
    accentCard: {
        height: '100%'
    }
})

interface IHouseStatusProps {
    balance: BigNumber
}

const HouseStatus: FunctionComponent<
    IHouseStatusProps & WithStyles<typeof styles>
> = ({ classes, balance }) => (
    <Card className={classes.accentCard}>
        <CardHeader title="House Status" />
        <CardContent>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <AccountBalanceWallet />
                    </ListItemIcon>
                    <ListItemText
                        primary="Balance"
                        secondary={`${displayWeiToETH(balance)} DBETs`}
                    />
                </ListItem>
            </List>
        </CardContent>
    </Card>
)

export default withStyles(styles)(HouseStatus)
