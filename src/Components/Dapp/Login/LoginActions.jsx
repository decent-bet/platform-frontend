import React from 'react'
import { CardActions, RaisedButton } from 'material-ui'
import GenerateButton from './GenerateButton'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default function LoginActions({
    loginType,
    isLoginDisabled,
    onLoginListener,
    onGenerateMnemonicListener,
    onGeneratePrivateKeyListener
}) {
    return (
        <CardActions className="login-actions">
            <GenerateButton
                loginType={loginType}
                onGenerateMnemonicListener={onGenerateMnemonicListener}
                onGeneratePrivateKeyListener={onGeneratePrivateKeyListener}
            />
            <RaisedButton
                className="login-button"
                primary={true}
                disabled={isLoginDisabled}
                onClick={onLoginListener}
                label="Login"
                icon={<FontAwesomeIcon icon="key" />}
                />
        </CardActions>
    )
}
