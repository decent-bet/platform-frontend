import React, { FunctionComponent } from 'react'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { IHouseBalanceCardProps } from './IHouseBalanceCardProps'

const HouseBalanceCard: FunctionComponent<IHouseBalanceCardProps> = ({
    balance
}) => (
    <Card>
        <CardHeader title="House Status" subheader="Dolor sic amet" />
        <CardContent>
            <Typography>{`Current house balance: ${balance.toString()} DBETs`}</Typography>
        </CardContent>
    </Card>
)

export default HouseBalanceCard
