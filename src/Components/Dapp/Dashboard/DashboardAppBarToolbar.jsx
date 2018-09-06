import React, { Fragment } from 'react'
import { Button } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Helper from '../../Helper'

const helper = new Helper()

function copyConfirmation() {
    helper.toggleSnackbar('Copied address to clipboard')
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
                <Button variant="flat" stlyle={{textTransform: 'none'}}>{addressText}</Button>
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
