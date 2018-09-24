import React, { Fragment } from 'react'
import { Button, ButtonBase, Typography } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Utils from '../shared/helpers/Utils'

function copyConfirmation() {
    Utils.toggleSnackbar('Copied address to clipboard')
}

export default function DashboardAppBarToolbar({
    address,
    tokenBalance,
    etherBalance
}) {
    // Null protection
    if (!etherBalance) {
        etherBalance = 0
    }
    if (!tokenBalance) {
        tokenBalance = 0
    }
    let addressText = `Public Address: ${address}`
    let tokenText = `Tokens: ${tokenBalance.toFixed(2)} DBETs`
    let etherText = `Balance: ${etherBalance.toFixed(5)} VTHO`
    
    return (
        <Fragment>
            <CopyToClipboard
                className="toolbar-button hidden-md-down"
                text={address}
                onCopy={copyConfirmation}
            >
                <ButtonBase component='button'>
                    <Typography stlyle={{textTransform: 'none'}}>{addressText}</Typography>
                </ButtonBase>
            </CopyToClipboard>
            <Button variant="flat" className="toolbar-button">
                {tokenText}
            </Button>
            <Button variant="flat" className="toolbar-button">
                {etherText}
            </Button>
        </Fragment>
    )
}
