import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import {DropDownMenu, MenuItem, MuiThemeProvider, TextField} from 'material-ui'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

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
const styles = require('../../Base/styles').styles()
const themes = new Themes()

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: constants.LOGIN_PRIVATE_KEY,
            key: '',
            mnemonic: '',
            provider: helper.getGethProvider(),
            localNodeGist: helper.getSelectedTestNet() == constants.TESTNET_SLOTS ?
                constants.LOCAL_NODE_GIST_SLOTS : constants.LOCAL_NODE_GIST_SPORTSBOOK,
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                }
            }
        }
        if (keyHandler.isLoggedIn())
            browserHistory.push(constants.VIEW_DEFAULT)
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

    views = () => {
        const self = this
        return {
            loginMethod: () => {
                return <div className="col-10 col-md-8 mx-auto login-method">
                    <div className="row">
                        <div className="col-9">
                            <RadioButtonGroup defaultSelected={self.state.login}
                                              onChange={(event, value) => {
                                                  let key = self.state.key
                                                  let mnemonic = self.state.mnemonic
                                                  if (value == constants.LOGIN_MNEMONIC)
                                                      mnemonic = ''
                                                  else
                                                      key = ''
                                                  self.setState({
                                                      key: key,
                                                      mnemonic: mnemonic,
                                                      login: value
                                                  })
                                              }}
                                              style={styles.radioButton.group}>
                                <RadioButton
                                    value={constants.LOGIN_MNEMONIC}
                                    iconStyle={styles.radioButton.icon}
                                    labelStyle={styles.radioButton.label}
                                    label="Passphrase"
                                />
                                <RadioButton
                                    value={constants.LOGIN_PRIVATE_KEY}
                                    iconStyle={styles.radioButton.icon}
                                    labelStyle={styles.radioButton.label}
                                    label="Private key"
                                />
                            </RadioButtonGroup>
                        </div>
                        <div className="col-3">
                            <RadioButtonGroup defaultSelected={helper.getGethProvider()}
                                              onChange={(event, value) => {
                                                  helper.setGethProvider(value)
                                                  self.setState({
                                                      provider: value
                                                  })
                                                  // Wait for dropdown animation
                                                  setTimeout(() => {
                                                      window.location.reload()
                                                  }, 500)
                                              }}
                                              style={styles.radioButton.group}>
                                <RadioButton
                                    value={constants.PROVIDER_INFURA}
                                    iconStyle={styles.radioButton.icon}
                                    labelStyle={styles.radioButton.label}
                                    label="Infura"
                                />
                                <RadioButton
                                    value={constants.PROVIDER_LOCAL}
                                    iconStyle={styles.radioButton.icon}
                                    labelStyle={styles.radioButton.label}
                                    label="Local node"
                                />
                            </RadioButtonGroup>
                        </div>
                    </div>
                </div>
            },
            enterCredentials: () => {
                return <div className="col-10 col-md-8 mx-auto enter-credentials">
                    <div className="row">
                        <div className="col-12 mt-4 mb-2">
                            <TextField
                                type="text"
                                fullWidth={true}
                                multiLine={true}
                                hintText={self.helpers().getHint()}
                                hintStyle={styles.textField.hintStyle}
                                inputStyle={styles.textField.inputStyle}
                                floatingLabelStyle={styles.textField.floatingLabelStyle}
                                floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                underlineStyle={styles.textField.underlineStyle}
                                underlineFocusStyle={styles.textField.underlineStyle}
                                value={self.state.login == constants.LOGIN_MNEMONIC ?
                                    self.state.mnemonic :
                                    self.state.key}
                                onChange={(event, value) => {
                                    let state = self.state
                                    if (state.login == constants.LOGIN_PRIVATE_KEY)
                                        state.key = value
                                    else if (state.login == constants.LOGIN_MNEMONIC)
                                        state.mnemonic = value
                                    self.setState(state)
                                }}
                                onKeyPress={self.helpers().loginWithKeyPress}
                            />
                        </div>
                        {   self.state.login == constants.LOGIN_MNEMONIC &&
                        <div className="col-12 mb-2 generate">
                            <p className="text-center" onClick={self.actions().generateMnemonic}>Generate passphrase</p>
                        </div>
                        }
                        {   self.state.login == constants.LOGIN_PRIVATE_KEY &&
                        <div className="col-12 mb-2 generate">
                            <p className="text-center" onClick={self.actions().generatePrivateKey}>Generate private
                                key</p>
                        </div>
                        }
                    </div>
                </div>
            },
            loginButton: () => {
                return <div className={"col-10 col-md-8 mx-auto login-button " +
                (!self.helpers().isValidCredentials() ? 'disabled' : '')}
                            onClick={() => {
                                if (self.helpers().isValidCredentials())
                                    self.actions().login()
                            }}>
                    <p className="text-center"><i className="fa fa-key mr-2"/> Login</p>
                </div>
            },
            nodeInfo: () => {
                return <div className="col-10 col-md-8 mx-auto mt-2 node-info">
                    {   self.state.provider == constants.PROVIDER_INFURA &&
                    <p className="text-center">Note: Infura nodes may not be fully reliable, so you may
                        experience
                        intermittent problems when using them. However since you skip the setup required for
                        running
                        a
                        local node,
                        it's easier to get started.<br/><br/>You will need Rinkeby Testnet ether to send transactions. For
                        instructions to do so, <a
                            href="https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc#step-4-request-eth"
                            target="_blank">click here</a></p>
                    }
                    {   self.state.provider == constants.PROVIDER_LOCAL &&
                    <p className="text-center">For instructions on how to set up a local node,
                        click <a href={self.state.localNodeGist} target="_blank">here</a></p>
                    }
                </div>
            },
            contact: () => {
                return <div className="col-10 col-md-8 mx-auto mt-2 contact">
                    <p className="text-center">Need help? Join our #testnet_testers channel on our <a
                        href="https://decent-bet.slack.com" target="_blank">Slack</a>.
                        For an invitation to our Slack, email <a href="#">support@decent.bet</a></p>
                </div>
            },
            tryOtherTestnet: () => {
                return <div className="col-10 col-md-8 mx-auto mt-2 try-other">
                    <p className="text-center">
                        Try out Decent.bet's&nbsp;
                        {helper.getSelectedTestNet() == constants.TESTNET_SPORTSBOOK &&
                        <a href="https://slots-testnet.decent.bet" target="_blank">Slots Testnet</a>}
                        {helper.getSelectedTestNet() == constants.TESTNET_SLOTS &&
                        <a href="https://sportsbook-testnet.decent.bet" target="_blank">Sportsbook Testnet</a>}
                    </p>
                </div>
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

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="login">
                    <div className="container h-100">
                        <div className="row h-100">
                            <div className="col">
                                <div className="row">
                                    {self.views().loginMethod()}
                                    {self.views().enterCredentials()}
                                    {self.views().loginButton()}
                                    {self.views().nodeInfo()}
                                    {self.views().contact()}
                                    {self.views().tryOtherTestnet()}
                                </div>
                            </div>
                        </div>
                    </div>
                    {self.dialogs().error()}
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Login