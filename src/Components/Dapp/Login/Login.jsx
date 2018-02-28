import React, { Component } from 'react'
import { MuiThemeProvider, Card, CardText } from 'material-ui'
import LoginActions from './LoginActions'
import LoginMethods from './LoginMethods'
import LoginField from './LoginField'

import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import Helper from '../../Helper'
import KeyHandler from '../../Base/KeyHandler'
import Themes from '../../Base/Themes'

import './login.css'

const bip39 = require('bip39')
const constants = require('../../Constants')
const ethers = require('ethers')
const Wallet = ethers.Wallet

const helper = new Helper()
const keyHandler = new KeyHandler()
const themes = new Themes()

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: constants.LOGIN_PRIVATE_KEY,
            key: '',
            mnemonic: '',
            provider: helper.getGethProvider(),
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                }
            }
        }
    }

    login = () => {
        if (this.state.login === constants.LOGIN_PRIVATE_KEY) {
            this.loginPrivateKey()
        } else if (this.state.login === constants.LOGIN_MNEMONIC) {
            this.loginMnemonic()
        }
    }

    loginPrivateKey = () => {
        try {
            const wallet = new Wallet(this.state.key)
            keyHandler.set(wallet.privateKey, wallet.address)
            this.props.history.push('/')
        } catch (e) {
            this.toggleErrorDialog(
                true,
                'Error',
                "Invalid private key. Please make sure you're entering a valid private key"
            )
        }
    }

    loginMnemonic = () => {
        try {
            const wallet = Wallet.fromMnemonic(this.state.mnemonic)
            keyHandler.set(wallet.privateKey, wallet.address)
            this.props.history.push('/')
        } catch (e) {
            this.toggleErrorDialog(
                true,
                'Error',
                "Invalid mnemonic. Please make sure you're entering a valid mnemonic"
            )
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

    getHint = () => {
        switch (this.state.login) {
            case constants.LOGIN_MNEMONIC:
                return 'Enter your passphrase'
            case constants.LOGIN_PRIVATE_KEY:
                return 'Enter your private key'
            default:
                // Should never happen
                return ''
        }
    }

    toggleErrorDialog = (open, title, message) => {
        let dialogs = this.state.dialogs
        dialogs.error = {
            open: open,
            title: title,
            message: message
        }
        this.setState({
            dialogs: dialogs
        })
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

    onCloseErrorDialogListener = () => this.toggleErrorDialog(false)

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

    onProviderChangedListener = (event, value) => {
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
            title={this.state.dialogs.error.title}
            message={this.state.dialogs.error.message}
            open={this.state.dialogs.error.open}
        />
    )

    render() {
        let logoUrl = `${
            process.env.PUBLIC_URL
        }/assets/img/logos/dbet-white.png`
        let value =
            this.state.login === constants.LOGIN_MNEMONIC
                ? this.state.mnemonic
                : this.state.key
        return (
            <MuiThemeProvider muiTheme={themes.getMainTheme()}>
                <main className="login">
                    <div className="container">
                        <Card className="login-card">
                            <CardText className="login-inner">
                                <div className="logo-container">
                                    <img
                                        className="logo"
                                        src={logoUrl}
                                        alt="Decent.bet Logo"
                                    />
                                </div>
                                <LoginMethods
                                    loginMethod={this.state.login}
                                    provider={this.state.provider}
                                    onLoginMethodChangeListener={
                                        this.onLoginMethodChangeListener
                                    }
                                    onProviderChangedListener={
                                        this.onProviderChangedListener
                                    }
                                />
                                <LoginField
                                    hintText={this.getHint()}
                                    value={value}
                                    onChange={this.onLoginTextChangedListener}
                                    onLoginKeypress={this.loginWithKeyPress}
                                />
                            </CardText>

                            <LoginActions
                                loginType={this.state.login}
                                onGenerateMnemonicListener={
                                    this.generateMnemonic
                                }
                                onGeneratePrivateKeyListener={
                                    this.generatePrivateKey
                                }
                                isLoginDisabled={!this.isValidCredentials()}
                                onLoginListener={this.onLoginListener}
                            />
                        </Card>
                    </div>
                    {this.renderErrorDialog()}
                </main>
            </MuiThemeProvider>
        )
    }
}
