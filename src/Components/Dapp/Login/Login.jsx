import React, { Component } from 'react'
import { Card } from 'material-ui'
import LoginActions from './LoginActions'
import LoginInner from './LoginInner'
import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import Helper from '../../Helper'
import KeyHandler from '../../Base/KeyHandler'
import bip39 from 'bip39'
import * as constants from '../../Constants'
import { Wallet } from 'ethers'

import './login.css'

const helper = new Helper()
const keyHandler = new KeyHandler()

export default class Login extends Component {
    state = {
        login: constants.LOGIN_MNEMONIC,
        key: '',
        mnemonic: '',
        provider: helper.getGethProvider(),
        isErrorDialogOpen: false,
        errorDialogTitle: '',
        errorDialogMessage: ''
    }

    login = () => {
        let errorDialogMessage
        try {
            let wallet
            if (this.state.login === constants.LOGIN_PRIVATE_KEY) {
                errorDialogMessage =
                    "Invalid private key. Please make sure you're entering a valid private key"
                wallet = new Wallet(this.state.key)
            } else if (this.state.login === constants.LOGIN_MNEMONIC) {
                errorDialogMessage =
                    "Invalid mnemonic. Please make sure you're entering a valid mnemonic"
                wallet = Wallet.fromMnemonic(this.state.mnemonic)
            }
            keyHandler.set(wallet.privateKey, wallet.address)

            // Go to the Root
            this.props.history.push('/')
        } catch (e) {
            this.setState({
                isErrorDialogOpen: true,
                errorDialogTitle: 'Error',
                errorDialogMessage
            })
        }
    }

    generateMnemonic = () => {
        let mnemonic = bip39.generateMnemonic()
        this.setState({ mnemonic: mnemonic })
    }

    generatePrivateKey = () => {
        try {
            let mnemonic = bip39.generateMnemonic()
            const wallet = Wallet.fromMnemonic(mnemonic)
            this.setState({ key: wallet.privateKey })
        } catch (e) {
            console.log('Error generating private key', e.message)
        }
    }

    isValidCredentials = () => {
        let isPrivateKeyValid =
            this.state.login === constants.LOGIN_PRIVATE_KEY &&
            this.state.key.length > 0
        let isMnemonicValid =
            this.state.login === constants.LOGIN_MNEMONIC &&
            this.state.mnemonic.length > 0
        return isPrivateKeyValid || isMnemonicValid
    }

    loginWithKeyPress = ev => {
        if (ev.key === 'Enter') {
            ev.preventDefault()
            this.onLoginListener()
        }
    }

    onCloseErrorDialogListener = () =>
        this.setState({ isErrorDialogOpen: false })

    onLoginListener = () => {
        if (this.isValidCredentials()) {
            this.login()
        }
    }

    onLoginMethodChangeListener = (event, value) => {
        let key = this.state.key
        let mnemonic = this.state.mnemonic
        if (value === constants.LOGIN_MNEMONIC) {
            mnemonic = ''
        } else {
            key = ''
        }
        this.setState({
            key: key,
            mnemonic: mnemonic,
            login: value
        })
    }

    onLoginTextChangedListener = (event, value) => {
        let state = this.state
        if (state.login === constants.LOGIN_PRIVATE_KEY) {
            state.key = value
        } else if (state.login === constants.LOGIN_MNEMONIC) {
            state.mnemonic = value
        }
        this.setState(state)
    }

    onProviderChangedListener = (event, index, value) => {
        helper.setGethProvider(value)
        this.setState({ provider: value })

        // Wait for dropdown animation
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    renderErrorDialog = () => (
        <ConfirmationDialog
            onClick={this.onCloseErrorDialogListener}
            onClose={this.onCloseErrorDialogListener}
            title={this.state.errorDialogTitle}
            message={this.state.errorDialogMessage}
            open={this.state.isErrorDialogOpen}
        />
    )

    renderCard = () => {
        let value =
            this.state.login === constants.LOGIN_MNEMONIC
                ? this.state.mnemonic
                : this.state.key
        return (
            <Card className="login-card">
                <LoginInner
                    loginMethod={this.state.login}
                    provider={this.state.provider}
                    value={value}
                    onChange={this.onLoginTextChangedListener}
                    onLoginKeypress={this.loginWithKeyPress}
                    onLoginMethodChangeListener={
                        this.onLoginMethodChangeListener
                    }
                    onProviderChangedListener={this.onProviderChangedListener}
                />

                <LoginActions
                    loginType={this.state.login}
                    onGenerateMnemonicListener={this.generateMnemonic}
                    onGeneratePrivateKeyListener={this.generatePrivateKey}
                    isLoginDisabled={!this.isValidCredentials()}
                    onLoginListener={this.onLoginListener}
                />
            </Card>
        )
    }

    render() {
        return (
            <main className="login">
                <div className="container">{this.renderCard()}</div>
                {this.renderErrorDialog()}
            </main>
        )
    }
}
