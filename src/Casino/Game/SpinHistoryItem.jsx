import React from 'react'
import { Typography } from '@material-ui/core'

export default function spinHistoryItem({ spin }) {
    let statusString = spin.isValid ? (
        <span className="text-success text-uppercase">Valid</span>
    ) : (
        <span className="text-danger text-uppercase">Invalid</span>
    )
    return (
        <tr>
            <td>
                <Typography>{spin.nonce}</Typography>
            </td>
            <td>
                <Typography>{spin.userHash}</Typography>
            </td>
            <td>
                <Typography>{spin.reelHash}</Typography>
            </td>
            <td>
                <Typography>{spin.reelSeedHash}</Typography>
            </td>
            <td className="no-text-break">
                <Typography>{JSON.stringify(spin.reel)}</Typography>
            </td>
            <td className="no-text-break">
                <Typography>{statusString}</Typography>
            </td>
        </tr>
    )
}
