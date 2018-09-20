import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card } from '@material-ui/core'
import LoginActions from './LoginActions'
import LoginInner from './LoginInner'
import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import { Thunks } from '../../../Model/auth'
import { cry } from 'thor-devkit'
import './login.css'

class Login extends Component {

    state = {
        value: '',
        isErrorDialogOpen: false
    }

    componentDidMount() {
        if(this.props.dispatch(Thunks.userIsLoggedIn())) {
            this.props.history.push('/') 
        } else {
            this.props.dispatch(Thunks.getCurrentStage())
        }
    }

    login = () => {
        this.props.dispatch(Thunks.login(this.state.value))
        .then(() => {
            // Go to the Root
            this.props.history.push('/') 
        })
        .catch(() => {
            this.setState({
                isErrorDialogOpen: true
            })
        })
    }

    generateMnemonic = () => {
        let mnemonic = cry.mnemonic.generate().join(' ')
        this.setState({ value: mnemonic })
    }

    isValidCredentials = () => this.state.value.length > 0

    loginWithKeyPress = ev => {
        if (ev.key === 'Enter') {
            this.onLoginListener(ev)
        }
    }

    onCloseErrorDialogListener = () =>
        this.setState({ isErrorDialogOpen: false })

    onLoginListener = (e) => {
        e.preventDefault()
        if (this.isValidCredentials()) {
            this.login()
        }
    }

    onLoginTextChangedListener = event =>
        this.setState({ value: event.target.value })
    
    onStageChangeListener = async (event) => {
        await this.props.dispatch(Thunks.setCurrentStage(event.target.value))
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
                currentStage={this.props.currentStage}
                value={this.state.value}
                onChange={this.onLoginTextChangedListener}
                onLoginKeypress={this.loginWithKeyPress}
                onStageChangeListener={this.onStageChangeListener}
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
