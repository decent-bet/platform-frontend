import React, { Fragment } from 'react'
import { RadioButtonGroup, RadioButton, Divider } from 'material-ui'

const constants = require('../../Constants')

export default function LoginMethods({
    loginMethod,
    provider,
    onLoginMethodChangeListener,
    onProviderChangedListener
}) {
    return (
        <Fragment>
            <div className="half">
                <h3>Provider Type</h3>
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
        </Fragment>
    )
}
