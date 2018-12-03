import React, { FunctionComponent } from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { IHouseBalanceCardProps } from './IHouseBalanceCardProps'
import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'

function houseBalance(balance: BigNumber): string {
    return ethUnits.convert(balance.toString(), 'wei', 'ether')
}

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
