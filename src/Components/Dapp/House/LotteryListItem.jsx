import React from 'react'

export default function LotteryListItem({ index, ticket }) {
    return (
        <tr>
            <td>{index}</td>
            <td>{ticket}</td>
        </tr>
    )
}
