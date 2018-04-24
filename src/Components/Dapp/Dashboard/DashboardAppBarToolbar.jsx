import React, { Fragment } from 'react'
import { FlatButton } from 'material-ui'
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
    let addressText = `Public Address: ${address}`
    let tokenText = `Tokens: ${tokenBalance} DBETs`
    let etherText = `Balance: ${etherBalance} Ether`
    return (
        <Fragment>
            <CopyToClipboard
                className="toolbar-button hidden-md-down"
                text={address}
                onCopy={copyConfirmation}
            >
                <FlatButton label={addressText} />
            </CopyToClipboard>
            <FlatButton className="toolbar-button" label={tokenText} />
            <FlatButton className="toolbar-button" label={etherText} />
        </Fragment>
    )
}
