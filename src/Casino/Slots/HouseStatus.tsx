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
import {
    AccountBalanceWallet,
    TrendingFlat,
    TrendingUp,
    TrendingDown
} from '@material-ui/icons'
import BigNumber from 'bignumber.js'
import { displayDBET } from './common/functions'

const styles = createStyles({
    accentCard: {
        height: '100%'
    }
})

interface IHouseStatusProps {
    currentBalance: BigNumber
    monthlyBalance: BigNumber
    initialDeposit: BigNumber
}

const HouseStatus: FunctionComponent<
    IHouseStatusProps & WithStyles<typeof styles>
> = ({ classes, currentBalance, monthlyBalance, initialDeposit }) => {
    // Calculate the current winnings for this month
    const currentWinnings = currentBalance
        .minus(monthlyBalance)
        .minus(initialDeposit)

    // Change the icon according to the winnings.
    let currentWinningsIcon: JSX.Element
    if (currentWinnings.isZero()) {
        currentWinningsIcon = <TrendingFlat />
    } else if (currentWinnings.isPositive()) {
        currentWinningsIcon = <TrendingUp />
    } else if (currentWinnings.isNegative()) {
        currentWinningsIcon = <TrendingDown />
    } else {
        currentWinningsIcon = <TrendingFlat />
    }

    return (
        <Card className={classes.accentCard}>
            <CardHeader title="House Status" />
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <AccountBalanceWallet />
                        </ListItemIcon>
                        <ListItemText
                            primary="Total balance"
                            secondary={`${displayDBET(currentBalance)} DBETs`}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>{currentWinningsIcon}</ListItemIcon>
                        <ListItemText
                            primary="This month's winnings"
                            secondary={`${displayDBET(currentWinnings)} DBETs`}
                        />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(HouseStatus)
