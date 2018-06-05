import React from 'react'
import { CardActions, Button } from '@material-ui/core'

export default function LoginActions({
    isLoginDisabled,
    onLoginListener,
    onGenerateMnemonicListener
}) {
    return (
        <CardActions className="login-actions">
            <Button
                variant="raised"
                onClick={onGenerateMnemonicListener}
                className="generate"
            >
                Create New Passphase
            </Button>
            <Button
                variant="raised"
                className="login-button"
                primary={true}
                disabled={isLoginDisabled}
                onClick={onLoginListener}
            >
                Login
            </Button>
        </CardActions>
    )
}
