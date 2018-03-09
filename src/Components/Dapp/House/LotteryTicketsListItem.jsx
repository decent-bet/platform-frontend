import React from 'react'

export default function LotteryTicketsListItem({ index, ticket }) {
    return (
        <tr>
            <td>{index}</td>
            <td>{ticket}</td>
        </tr>
    )
}
