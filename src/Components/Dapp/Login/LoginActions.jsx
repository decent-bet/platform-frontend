import React from 'react'
import { CardActions, RaisedButton } from 'material-ui'

export default function LoginActions({
    isLoginDisabled,
    onLoginListener,
    onGenerateMnemonicListener
}) {
    return (
        <CardActions className="login-actions">
            <RaisedButton
                label="Create New Passphase"
                onClick={onGenerateMnemonicListener}
                className="generate"
            />
            <RaisedButton
                className="login-button"
                primary={true}
                disabled={isLoginDisabled}
                onClick={onLoginListener}
                label="Login"
            />
        </CardActions>
    )
}
