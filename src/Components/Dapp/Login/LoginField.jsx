import React, { Fragment } from 'react'
import { TextField, FlatButton } from 'material-ui'

const constants = require('../../Constants')

function GenerateButton({
    loginType,
    onGenerateMnemonicListener,
    onGeneratePrivateKeyListener
}) {
    if (loginType === constants.LOGIN_MNEMONIC) {
        return (
            <FlatButton
                className="generate"
                onClick={onGenerateMnemonicListener}
                label="Generate Passphase"
            />
        )
    } else if (loginType === constants.LOGIN_PRIVATE_KEY) {
        return (
            <FlatButton
                className="generate"
                onClick={onGeneratePrivateKeyListener}
                label="Generate Private Key"
            />
        )
    }
}

export default function LoginField({
    hintText,
    loginType,
    value,
    onChange,
    onLoginKeypress,
    onGenerateMnemonicListener,
    onGeneratePrivateKeyListener
}) {
    return (
        <Fragment>
            <TextField
                type="text"
                fullWidth={true}
                multiLine={true}
                floatingLabelText={hintText}
                value={value}
                onChange={onChange}
                onKeyPress={onLoginKeypress}
            />
            <GenerateButton
                loginType={loginType}
                onGenerateMnemonicListener={onGenerateMnemonicListener}
                onGeneratePrivateKeyListener={onGeneratePrivateKeyListener}
            />
        </Fragment>
    )
}
