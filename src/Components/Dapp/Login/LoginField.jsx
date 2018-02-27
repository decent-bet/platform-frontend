import React, { Fragment } from 'react'
import { TextField } from 'material-ui'

const styles = require('../../Base/styles').styles()
const constants = require('../../Constants')

function GenerateButton({
    loginType,
    onGenerateMnemonicListener,
    onGeneratePrivateKeyListener
}) {
    if (loginType === constants.LOGIN_MNEMONIC) {
        return (
            <p className="text-center" onClick={onGenerateMnemonicListener}>
                Generate passphrase
            </p>
        )
    } else if (loginType === constants.LOGIN_PRIVATE_KEY) {
        return (
            <p className="text-center" onClick={onGeneratePrivateKeyListener}>
                Generate private key
            </p>
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
            <div className="col-12 mt-4 mb-2">
                <TextField
                    type="text"
                    fullWidth={true}
                    multiLine={true}
                    hintText={hintText}
                    hintStyle={styles.textField.hintStyle}
                    inputStyle={styles.textField.inputStyle}
                    floatingLabelStyle={styles.textField.floatingLabelStyle}
                    floatingLabelFocusStyle={
                        styles.textField.floatingLabelFocusStyle
                    }
                    underlineStyle={styles.textField.underlineStyle}
                    underlineFocusStyle={styles.textField.underlineStyle}
                    value={value}
                    onChange={onChange}
                    onKeyPress={onLoginKeypress}
                />
            </div>

            <div className="col-12 mb-2 generate">
                <GenerateButton
                    loginType={loginType}
                    onGenerateMnemonicListener={onGenerateMnemonicListener}
                    onGeneratePrivateKeyListener={onGeneratePrivateKeyListener}
                />
            </div>
        </Fragment>
    )
}
