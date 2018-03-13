import * as React from 'react'

export interface LotteryTicketsListItemProps {
    index: number
    ticket: string
}

export default function LotteryTicketsListItem(
    props: LotteryTicketsListItemProps
) {
    return (
        <tr>
            <td>{props.index}</td>
            <td>{props.ticket}</td>
        </tr>
    )
}
