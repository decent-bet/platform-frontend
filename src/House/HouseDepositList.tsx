import React, { FunctionComponent } from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core'
import { Check } from '@material-ui/icons'
import { IDepositItem } from './state/IDepositItem'
import { displayWeiToETH } from './common/functions'

/**
 * Represents a single deposit in the `HouseDepositList`
 * @param deposit The Deposit that will be rendered
 */
const HouseDepositListItem: FunctionComponent<{
    deposit: IDepositItem
}> = ({ deposit }) => (
    <ListItem>
        <ListItemIcon>
            <Check />
        </ListItemIcon>
        <ListItemText
            primary={`${displayWeiToETH(
                deposit.amount
            )} DBETs @ ${deposit.date.toISOString()}`}
            secondary={`Transaction Hash: ${deposit.txHash}`}
        />
    </ListItem>
)

/**
 * A Card with a list of `IDeposit`s
 * @param houseDepositList List of deposits to render in a list
 * @param houseAddress The address to display in the widget
 */
const HouseDepositList: FunctionComponent<{
    houseDepositList: IDepositItem[]
    houseAddress: string
}> = ({ houseDepositList, houseAddress }) => (
    <Card>
        <CardHeader
            title="Deposits to the House Address"
            subheader={`Contract Address: ${houseAddress}`}
        />
        <CardContent>
            <List>
                {houseDepositList.map((item, index) => (
                    <HouseDepositListItem key={index} deposit={item} />
                ))}
            </List>
        </CardContent>
    </Card>
)

export default HouseDepositList
