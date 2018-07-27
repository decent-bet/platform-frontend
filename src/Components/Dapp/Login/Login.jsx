import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card } from '@material-ui/core'
import LoginActions from './LoginActions'
import LoginInner from './LoginInner'
import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import { ThorConnection } from '../../../Web3/ThorConnection'
import bip39 from 'bip39'
import { Wallet } from 'ethers'
import { Actions, initWatchers } from '../../../Model/balance'

import './login.css'

class Login extends Component {
    
    state = {
        value: '',
        provider: ThorConnection.getProviderUrl(),
        isErrorDialogOpen: false
    }

    login = () => {
        try {
            let wallet
            let login = this.state.value
            if (login.includes(' ')) {
                // Passphrase Mnemonic mode
                wallet = Wallet.fromMnemonic(login)
            } else {
                // Private Key Mode
                // Adds '0x' to the beginning of the key if it is not there.
                if (login.substring(0, 2) !== '0x') {
                    login = '0x' + login
                }

                wallet = new Wallet(login)
            }
            
            ThorConnection.setCredentials(wallet.privateKey, wallet.address)
            ThorConnection.buildThor()
            ThorConnection.buildContracts()

             // Initialize the datastore
            this.props.dispatch(Actions.getPublicAddress())
            this.props.dispatch(Actions.getTokens())
            this.props.dispatch(Actions.getEtherBalance())
            this.props.dispatch(initWatchers)
            // Go to the Root
            this.props.history.push('/')
        } catch (e) {
            // Login Failed. Open error dialog.
            this.setState({
                isErrorDialogOpen: true
            })
        }
    }

    generateMnemonic = () => {
        let mnemonic = bip39.generateMnemonic()
        this.setState({ value: mnemonic })
    }

    isValidCredentials = () => this.state.value.length > 0

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

    onLoginTextChangedListener = event =>
        this.setState({ value: event.target.value })

    onProviderChangedListener = (event, index, value) => {
        ThorConnection.setProviderUrl(value)
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
            title="Invalid Login"
            message="Please make sure you're entering a valid Private Key or Passphase"
            open={this.state.isErrorDialogOpen}
        />
    )

    renderCard = () => (
        <Card className="login-card">
            <LoginInner
                loginMethod={this.state.login}
                provider={this.state.provider}
                value={this.state.value}
                onChange={this.onLoginTextChangedListener}
                onLoginKeypress={this.loginWithKeyPress}
                onProviderChangedListener={this.onProviderChangedListener}
            />

            <LoginActions
                onGenerateMnemonicListener={this.generateMnemonic}
                isLoginDisabled={!this.isValidCredentials()}
                onLoginListener={this.onLoginListener}
            />
        </Card>
    )

    render() {
        return (
            <main className="login">
                {this.renderCard()}
                {this.renderErrorDialog()}
            </main>
        )
    }
}



// Connect this component to Redux
export default connect(state => state)(Login)