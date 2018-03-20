import React, { Fragment } from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Helper from '../../Helper'

const styles = require('../../Base/styles').styles()
const helper = new Helper()

function getFormattedBalance(balance) {
    if (balance) return helper.roundDecimals(helper.formatEther(balance), 4)
    else return 0
}

function copyConfirmation() {
    helper.toggleSnackbar('Copied address to clipboard')
}

export default function DashboardAppBarToolbar({
    address,
    onFaucetClickedListener,
    etherBalance
}) {
    let balanceText = `Balance: ${getFormattedBalance(etherBalance)} DBETs`
    return (
        <Fragment>
            <FlatButton
                className="hidden-md-down mr-2"
                label={
                    <CopyToClipboard text={address} onCopy={copyConfirmation}>
                        <span>Public Address: {address}</span>
                    </CopyToClipboard>
                }
                labelStyle={styles.addressLabel}
            />
            <FlatButton
                labelStyle={styles.addressLabel}
                label={balanceText}
            />
            <RaisedButton
                secondary={true}
                label="Claim faucet"
                onClick={onFaucetClickedListener}
            />
        </Fragment>
    )
}
