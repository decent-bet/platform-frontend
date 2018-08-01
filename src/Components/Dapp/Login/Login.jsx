import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card } from '@material-ui/core'
import LoginActions from './LoginActions'
import LoginInner from './LoginInner'
import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import { ThorConnection } from '../../../Web3/ThorConnection'
import bip39 from 'bip39'

import './login.css'

class Login extends Component {
    
    state = {
        value: '',
        provider: ThorConnection.getProviderUrl(),
        isErrorDialogOpen: false
    }

    login = () => {
        try {
            
            let login = this.state.value
            
            ThorConnection.make(login)

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