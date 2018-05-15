import { SHA256 } from 'crypto-js'
import React from 'react'
import SpinHistoryItem from './SpinHistoryItem'

export default function spinHistory({ houseSpins, userHashes }) {
    let spinArray
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
                    <th>#</th>
                    <th>User Hash</th>
                    <th>Reel Hash</th>
                    <th>Reel Seed Hash</th>
                    <th>Reel</th>
                    <th>Valid?</th>
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
