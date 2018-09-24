import React from 'react'
import { CardActions, Button } from '@material-ui/core'

export default function LoginActions({
    isLoginDisabled,
    onLoginListener,
    onGenerateMnemonicListener
}) {
    return (
        <CardActions>
            <Button
                variant="outlined"
                onClick={onGenerateMnemonicListener}
                className="generate"
            >
                Create New Passphase
            </Button>
            <Button
                variant="raised"
                className="login-button"
                color="primary"
                disabled={isLoginDisabled}
                onClick={onLoginListener}
            >
                Login
            </Button>
        </CardActions>
    )
}
