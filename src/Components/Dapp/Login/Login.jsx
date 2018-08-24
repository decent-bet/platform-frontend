import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card } from '@material-ui/core'
import LoginActions from './LoginActions'
import LoginInner from './LoginInner'
import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import { Actions, Thunks } from '../../../Model/auth'
import bip39 from 'bip39'
import './login.css'
import { KeyHandler } from '../../../Web3'

const keyHandler = new KeyHandler()

class Login extends Component {

    state = {
        value: '',
        isErrorDialogOpen: false
    }

    componentDidMount() {
        if(keyHandler.isLoggedIn()) {
            window.location.href = '/'
        } else {
            this.props.dispatch(Thunks.getProviderUrl())
        }
    }

    login = () => {
        try {
            this.props.dispatch(Actions.login(this.state.value))
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
        this.props.dispatch(Thunks.setProviderUrl(value))
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
                provider={this.props.provider}
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
export default connect(state => state.auth)(Login)
