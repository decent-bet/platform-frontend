import React, {Component} from 'react'
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

class Login extends Component {

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
        if (keyHandler.isLoggedIn())
        {
            props.history.push(constants.VIEW_DEFAULT)
        }
    }

    actions = () => {
        const self = this
        return {
            login: () => {
                if (self.state.login == constants.LOGIN_PRIVATE_KEY)
                    self.actions().loginPrivateKey()
                else if (self.state.login == constants.LOGIN_MNEMONIC)
                    self.actions().loginMnemonic()
            },
            loginPrivateKey: () => {
                try {
                    const wallet = new Wallet(self.state.key)
                    keyHandler.set(wallet.privateKey, wallet.address)
                    window.location = '/'
                } catch (e) {
                    self.helpers().toggleErrorDialog(true, 'Error',
                        'Invalid private key. Please make sure you\'re entering a valid private key')
                }
            },
            loginMnemonic: () => {
                try {
                    const wallet = Wallet.fromMnemonic(self.state.mnemonic)
                    keyHandler.set(wallet.privateKey, wallet.address)
                    window.location = '/'
                } catch (e) {
                    self.helpers().toggleErrorDialog(true, 'Error',
                        'Invalid mnemonic. Please make sure you\'re entering a valid mnemonic')
                }
            },
            generateMnemonic: () => {
                let mnemonic = bip39.generateMnemonic()
                self.setState({
                    mnemonic: mnemonic
                })
            },
            generatePrivateKey: () => {
                try {
                    let mnemonic = bip39.generateMnemonic()
                    const wallet = Wallet.fromMnemonic(mnemonic)
                    self.setState({
                        key: wallet.privateKey
                    })
                } catch (e) {
                    console.log('Error generating private key', e.message)
                }
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            error: () => {
                return <ConfirmationDialog
                    onClick={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    onClose={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    title={self.state.dialogs.error.title}
                    message={self.state.dialogs.error.message}
                    open={self.state.dialogs.error.open}
                />
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            toggleErrorDialog: (open, title, message) => {
                let dialogs = self.state.dialogs
                dialogs.error = {
                    open: open,
                    title: title,
                    message: message
                }
                self.setState({
                    dialogs: dialogs
                })
            },
            getHint: () => {
                switch (self.state.login) {
                    case constants.LOGIN_MNEMONIC:
                        return "Enter your passphrase"
                    case constants.LOGIN_PRIVATE_KEY:
                        return "Enter your private key"
                }
            },
            isValidCredentials: () => {
                return ((self.state.login == constants.LOGIN_PRIVATE_KEY && self.state.key.length > 0 ||
                self.state.login == constants.LOGIN_MNEMONIC && self.state.mnemonic.length > 0))
            },
            loginWithKeyPress: (ev) => {
                if (ev.key === 'Enter') {
                    ev.preventDefault()
                    if (self.helpers().isValidCredentials())
                        self.actions().login()
                }
            }
        }
    }

    onLoginListener = () => {
        if (this.helpers().isValidCredentials()){
            this.actions().login()
        }
    }

    onLoginMethodChangeListener = (event, value) => {
        let key = this.state.key
        let mnemonic = this.state.mnemonic
        if (value === constants.LOGIN_MNEMONIC){
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

    render() {
        let logoUrl = `${process.env.PUBLIC_URL}/assets/img/logos/dbet-white.png`
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
                                    onLoginMethodChangeListener={this.onLoginMethodChangeListener}
                                    onProviderChangedListener={this.onProviderChangedListener}
                                    />
                                <LoginField
                                    hintText={this.helpers().getHint()}
                                    value={
                                        this.state.login === constants.LOGIN_MNEMONIC
                                            ? this.state.mnemonic
                                            : this.state.key
                                    }
                                    onChange={this.onLoginTextChangedListener}
                                    onLoginKeypress={this.helpers().loginWithKeyPress}
                                />
                            </CardText>

                            <LoginActions
                                loginType={this.state.login}
                                onGenerateMnemonicListener={this.actions().generateMnemonic}
                                onGeneratePrivateKeyListener={this.actions().generatePrivateKey}
                                isLoginDisabled={!this.helpers().isValidCredentials()}
                                onLoginListener={this.onLoginListener}
                            />
                        </Card>
                    </div>
                    {this.dialogs().error()}
                </main>
            </MuiThemeProvider>
        )
    }

}

export default Login