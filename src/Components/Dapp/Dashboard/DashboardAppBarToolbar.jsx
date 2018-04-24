import React from 'react'
import { FlatButton } from 'material-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Helper from '../../Helper'
import { styles as Styles } from '../../Base/styles'

const styles = Styles()
const helper = new Helper()

function copyConfirmation() {
    helper.toggleSnackbar('Copied address to clipboard')
}

export default function DashboardAppBarToolbar({
    address,
    tokenBalance,
    etherBalance
}) {
    let tokenText = `Tokens: ${tokenBalance} DBETs`
    let etherText = `Balance: ${etherBalance} Ether`
    return (
        <div className="appbar-toolbar">
            <FlatButton
                className="hidden-md-down"
                label={
                    <CopyToClipboard text={address} onCopy={copyConfirmation}>
                        <span>Public Address: {address}</span>
                    </CopyToClipboard>
                }
                labelStyle={styles.addressLabel}
            />
            <FlatButton labelStyle={styles.addressLabel} label={tokenText} />
            <FlatButton labelStyle={styles.addressLabel} label={etherText} />
        </div>
    )
}
