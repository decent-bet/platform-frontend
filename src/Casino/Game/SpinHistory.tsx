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
import Utils from '../../common/helpers/Utils'

export default function spinHistory({ houseSpins, userHashes }) {
    let spinArray = []
    if (houseSpins) {
        spinArray = houseSpins.map(async spin => {
            const isValid =
                spin.reelHash ===
                (await Utils.sha256(spin.reelSeedHash + spin.reel.toString()))
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
                style={{ width: '100%', fontSize: '0.4em' }}
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
