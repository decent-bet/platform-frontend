import React from 'react'
import { TextField, CardContent } from '@material-ui/core'
import LoginNodeTypes from './LoginNodeTypes'

const logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.svg`

export default function LoginInner({
    currentStage,
    value,
    onChange,
    onLoginKeypress,
    onStageChangeListener
}) {
    return (
        <CardContent className="login-inner">
            <img className="logo" src={logoUrl} alt="Decent.bet Logo" />

            <LoginNodeTypes
                currentStage={currentStage}
                onStageChangeListener={onStageChangeListener}
            />

            <TextField
                className="input"
                type="text"
                fullWidth
                multiline
                label="Enter Passphrase or Private Key"
                value={value}
                onChange={onChange}
                onKeyPress={onLoginKeypress}
            />
        </CardContent>
    )
}
