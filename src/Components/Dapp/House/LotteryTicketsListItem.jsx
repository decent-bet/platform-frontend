import React from 'react'
import { Typography } from '@material-ui/core'

export default function LotteryTicketsListItem({ index, ticket }) {
    return (
        <tr>
            <Typography component="td">{index}</Typography>
            <Typography component="td">{ticket}</Typography>
        </tr>
    )
}
