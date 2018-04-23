import React from 'react'
import { TextField, CardText } from 'material-ui'
import LoginNodeTypes from './LoginNodeTypes'

const logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.svg`

export default function LoginInner({
    provider,
    value,
    onChange,
    onLoginKeypress,
    onProviderChangedListener
}) {
    return (
        <CardText className="login-inner">
            <header>
                <img className="logo" src={logoUrl} alt="Decent.bet Logo" />
            </header>

            <LoginNodeTypes
                provider={provider}
                onProviderChangedListener={onProviderChangedListener}
            />

            <TextField
                className="input"
                type="text"
                fullWidth={true}
                multiLine={true}
                floatingLabelText="Enter Passphrase or Private Key"
                value={value}
                onChange={onChange}
                onKeyPress={onLoginKeypress}
            />
        </CardText>
    )
}
