import { SHA256 } from 'crypto-js'
import React from 'react'
import SpinHistoryItem from './SpinHistoryItem'
import { Typography } from '@material-ui/core'

export default function spinHistory({ houseSpins, userHashes }) {
    let spinArray = []
    if (houseSpins) {
        spinArray = houseSpins.map(spin => {
            const isValid =
                spin.reelHash ===
                SHA256(spin.reelSeedHash + spin.reel.toString()).toString()
            const userHash = userHashes[userHashes.length - spin.nonce]
            return {
                ...spin,
                userHash,
                isValid
            }
        })
    }
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>
                        <Typography>#</Typography>
                    </th>
                    <th>
                        <Typography>User Hash</Typography>
                    </th>
                    <th>
                        <Typography>Reel Hash</Typography>
                    </th>
                    <th>
                        <Typography>Reel Seed Hash</Typography>
                    </th>
                    <th>
                        <Typography>Reel</Typography>
                    </th>
                    <th>
                        <Typography>Valid?</Typography>
                    </th>
                </tr>
            </thead>
            <tbody>
                {spinArray.map(spin => (
                    <SpinHistoryItem key={spin.nonce} spin={spin} />
                ))}
            </tbody>
        </table>
    )
}
