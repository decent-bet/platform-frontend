import React from 'react'
import { RaisedButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const constants = require('../../Constants')

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

            icon={<FontAwesomeIcon icon="user-plus" />}
            secondary={true}
            className="generate"
        />
    )
}
