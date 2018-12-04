import React, { FunctionComponent } from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { IHouseBalanceCardProps } from './IHouseBalanceCardProps'
import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'

function houseBalance(balance: BigNumber): string {
    return ethUnits.convert(balance.toString(), 'wei', 'ether')
}

/**
 * The card that shows the balance of the House Account
 * @param balance The amount to show in the card.
 */
const HouseBalanceCard: FunctionComponent<IHouseBalanceCardProps> = ({
    balance
}) => (
    <Card>
        <CardHeader title="House Status" />
        <CardContent>
            <Typography>{`Current house balance: ${houseBalance(
                balance
            )} DBETs`}</Typography>
        </CardContent>
    </Card>
)

export default HouseBalanceCard
