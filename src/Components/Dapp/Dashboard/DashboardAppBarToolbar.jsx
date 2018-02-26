import React, { Fragment } from 'react'
import { FlatButton } from 'material-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Helper from '../../Helper'

const styles = require('../../Base/styles').styles()
const helper = new Helper()

function getFormattedBalance(balance) {
    if (balance) return helper.roundDecimals(helper.formatEther(balance), 4)
    else return 0
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
                    <CopyToClipboard
                        text={address}
                        onCopy={() =>
                            helper.toggleSnackbar('Copied address to clipboard')
                        }
                    >
                        <span>Address: {address}</span>
                    </CopyToClipboard>
                }
                labelStyle={styles.addressLabel}
            />
            <button
                className="btn btn-sm btn-primary hvr-fade"
                style={styles.appbarButton}
                onClick={onFaucetClickedListener}
            >
                Claim Faucet
            </button>
            <button
                className="btn btn-sm btn-primary hvr-fade"
                style={styles.appbarButton}
            >
                {balanceText}
            </button>
        </Fragment>
    )
}
