import React from 'react'

export default function spinHistoryItem({ spin }) {
    let statusString = spin.isValid ? (
        <span className="text-success text-uppercase">Valid</span>
    ) : (
        <span className="text-danger text-uppercase">Invalid</span>
    )
    return (
        <tr>
            <td>{spin.nonce}</td>
            <td>{spin.userHash}</td>
            <td>{spin.reelHash}</td>
            <td>{spin.reelSeedHash}</td>
            <td>{JSON.stringify(spin.reel)}</td>
            <td>{spin.payout}</td>
            <td className="no-text-break">{statusString}</td>
        </tr>
    )
}
