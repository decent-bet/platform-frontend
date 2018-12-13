import { SHA256 } from 'crypto-js'
import React from 'react'
import {
    Grid,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography
} from '@material-ui/core'

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
        <Grid container={true} direction="row" style={{ overflowX: 'auto' }}>
            <Table
                style={{
                    fontSize: '0.4em',
                    position: 'relative'
                }}
                padding="checkbox"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography color="secondary">#</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="secondary">User Hash</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="secondary">Reel Hash</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="secondary">
                                Reel Seed Hash
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="secondary">Reel</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="secondary">Valid?</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {spinArray.map((spin: any) => {
                        return (
                            <TableRow key={spin.nonce} hover={true}>
                                <TableCell component="th" scope="row">
                                    {spin.nonce}
                                </TableCell>
                                <TableCell>{spin.userHash}</TableCell>
                                <TableCell>{spin.reelHash}</TableCell>
                                <TableCell>{spin.reelSeedHash}</TableCell>
                                <TableCell>
                                    {JSON.stringify(spin.reel)}
                                </TableCell>
                                <TableCell>
                                    {spin.isValid ? (
                                        <Typography
                                            variant="button"
                                            color="primary"
                                        >
                                            Valid{' '}
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="button"
                                            color="error"
                                        >
                                            Invalid
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </Grid>
    )
}
