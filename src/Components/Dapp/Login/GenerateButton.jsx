import React from 'react'
import { RaisedButton } from 'material-ui'
import * as constants from '../../Constants'

export default function GenerateButton({
    loginType,
    onGenerateMnemonicListener,
    onGeneratePrivateKeyListener
}) {

    /* Text and listener changes according to loginType */
    let variables = {}
    if (loginType === constants.LOGIN_MNEMONIC) {
        variables = {
            label: 'Create New Passphase',
            onClick: onGenerateMnemonicListener
        }
    } else if (loginType === constants.LOGIN_PRIVATE_KEY) {
        variables = {
            label: 'Create New Private Key',
            onClick: onGeneratePrivateKeyListener
        }
    }

    return (
        <RaisedButton
            {...variables}
            secondary={true}
            className="generate"
        />
    )
}
