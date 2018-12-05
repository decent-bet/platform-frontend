import React, { FunctionComponent } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core'
import { Inbox, AccountBalanceWallet } from '@material-ui/icons'
import { IHouseBalanceCardProps } from './IHouseBalanceCardProps'
import { displayWeiToETH } from './common/functions'

/**
 * The card that shows the balance of the House Account
 * @param balance The amount to show in the card.
 */
const HouseBalanceCard: FunctionComponent<IHouseBalanceCardProps> = ({
    balance,
    houseAddress
}) => (
    <Card>
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
export default HouseBalanceCard
