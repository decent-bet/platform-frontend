import React, { FunctionComponent } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    withStyles,
    WithStyles,
    Theme,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core'
import { Inbox, AccountBalanceWallet } from '@material-ui/icons'
import { IHouseBalanceCardProps } from './IHouseBalanceCardProps'
import { displayWeiToETH } from './common/functions'

const styles = (theme: Theme) => {
    const primaryColor = theme.palette.primary.main
    const textColor = theme.palette.getContrastText(primaryColor)
    return createStyles({
        accentContainer: {
            backgroundColor: primaryColor,
            '& span,p,svg': {
                color: textColor,
                wordBreak: 'break-word'
            }
        },
        accentText: {
            color: textColor
        }
    })
}

/**
 * The card that shows the balance of the House Account
 * @param balance The amount to show in the card.
 */
const HouseBalanceCard: FunctionComponent<
    IHouseBalanceCardProps & WithStyles<typeof styles>
> = ({ balance, houseAddress, classes }) => (
    <Card className={classes.accentContainer}>
        <CardHeader title="House Status" />
        <CardContent>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <Inbox />
                    </ListItemIcon>
                    <ListItemText
                        primary="Total Balance"
                        secondary={`${displayWeiToETH(balance)} DBETs`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <AccountBalanceWallet />
                    </ListItemIcon>
                    <ListItemText
                        primary="House Address"
                        secondary={houseAddress}
                    />
                </ListItem>
            </List>
        </CardContent>
    </Card>
)
export default withStyles(styles)(HouseBalanceCard)
