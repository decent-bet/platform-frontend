import React from 'react'
import { RadioButtonGroup, RadioButton, TextField, CardText } from 'material-ui'
import LoginNodeTypes from './LoginNodeTypes'

const constants = require('../../Constants')
const logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.png`

function getHint(valueType) {
    switch (valueType) {
        case constants.LOGIN_MNEMONIC:
            return 'Enter your passphrase'
        case constants.LOGIN_PRIVATE_KEY:
            return 'Enter your private key'
        default:
            // Should never happen
            return ''
    }
}

export default function LoginInner({
    loginMethod,
    provider,
    value,
    onChange,
    onLoginKeypress,
    onLoginMethodChangeListener,
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

            <RadioButtonGroup
                className="login-type"
                name="loginType"
                valueSelected={loginMethod}
                onChange={onLoginMethodChangeListener}
            >
                <RadioButton
                    value={constants.LOGIN_MNEMONIC}
                    label="Passphrase"
                />
                <RadioButton
                    value={constants.LOGIN_PRIVATE_KEY}
                    label="Private key"
                />
            </RadioButtonGroup>

            <TextField
                className="input"
                type="text"
                fullWidth={true}
                multiLine={true}
                floatingLabelText={getHint(loginMethod)}
                value={value}
                onChange={onChange}
                onKeyPress={onLoginKeypress}
            />
        </CardText>
    )
}
