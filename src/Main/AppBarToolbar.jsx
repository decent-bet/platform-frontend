import React, { Fragment } from 'react'
import { Button, ButtonBase, Typography } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default function AppBarToolbar({
    address,
    tokenBalance,
    vthoBalance,
    onCopyAddress,
    accountHasAddress,
    isCasinoLogedIn
}) {
    // Null protection
    if (!vthoBalance) {
        vthoBalance = 0
    }
    if (!tokenBalance) {
        tokenBalance = 0
    }

    let addressText = `Public Address: ${address}`
    let tokenText = `Tokens: ${tokenBalance.toFixed(2)} DBETs`
    let etherText = `Balance: ${vthoBalance.toFixed(5)} VTHO`

    return (
        <Fragment>
            {accountHasAddress ? (
                <CopyToClipboard
                    className="toolbar-button hidden-md-down"
                    text={address}
                    onCopy={onCopyAddress}
                >
                    <ButtonBase component="button">
                        <Typography stlyle={{ textTransform: 'none' }}>
                            {addressText}
                        </Typography>
                    </ButtonBase>
                </CopyToClipboard>
            ) : null}

            {isCasinoLogedIn ? (
                <React.Fragment>
                    <Button variant="flat" className="toolbar-button">
                        {tokenText}
                    </Button>
                    <Button variant="flat" className="toolbar-button">
                        {etherText}
                    </Button>
                </React.Fragment>
            ) : null}
        </Fragment>
    )
}
