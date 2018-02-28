import React from 'react'
import { CardActions, RaisedButton } from 'material-ui'
import GenerateButton from './GenerateButton'

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
                icon={<i className="fa fa-key mr-2"/>}
                />
        </CardActions>
    )
}
