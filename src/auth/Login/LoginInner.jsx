import React from 'react'
import { TextField, CardContent } from '@material-ui/core'
import LoginNodeTypes from './LoginNodeTypes'

export default function LoginInner({
    currentStage,
    value,
    onChange,
    onLoginKeypress,
    onStageChangeListener
}) {
    const logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.svg`
    
    return (
        <CardContent>
            <img src={logoUrl} alt="Decent.bet Logo" style={{maxHeight: 48}}/>

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
