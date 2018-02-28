import React from 'react'
import { RadioButtonGroup, RadioButton, TextField, CardText } from 'material-ui'

const constants = require('../../Constants')
const logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.png`

function getHint(valueType){
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
            <div className="logo-container">
                <img className="logo" src={logoUrl} alt="Decent.bet Logo" />
            </div>

            <div className="half">
                <h3>Provider Node</h3>
                <RadioButtonGroup
                    name="providerType"
                    valueSelected={provider}
                    onChange={onProviderChangedListener}
                >
                    <RadioButton
                        value={constants.PROVIDER_DBET}
                        label="DBET Node"
                    />
                    <RadioButton
                        value={constants.PROVIDER_LOCAL}
                        label="Local Node"
                    />
                    <RadioButton
                        value={constants.PROVIDER_INFURA}
                        label="Infura"
                    />
                </RadioButtonGroup>
            </div>

            <div className="half">
                <h3>Login Type</h3>
                <RadioButtonGroup
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
            </div>

            <TextField
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
