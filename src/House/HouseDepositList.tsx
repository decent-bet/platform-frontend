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
import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'

function parseDepositAmount(amount: BigNumber): string {
    return ethUnits.convert(amount.toString(), 'wei', 'ether')
}

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
            primary={deposit._address}
            secondary={`${parseDepositAmount(deposit.amount)} DBETs`}
        />
    </ListItem>
)

/**
 * A Card with a list of `IDeposit`s
 * @param houseDepositList List of deposits to render in a list
 */
const HouseDepositList: FunctionComponent<{
    houseDepositList: IDepositItem[]
}> = ({ houseDepositList }) => (
    <Card>
        <CardHeader title="Deposits to the House Address" />
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
