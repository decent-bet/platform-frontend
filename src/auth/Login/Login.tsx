import * as React from 'react'
import { connect } from 'react-redux'
import { Card, Grid, Paper } from '@material-ui/core'
import LoginActions from './LoginActions'
import LoginInner from './LoginInner'
import ConfirmationDialog from '../../shared/dialogs/ConfirmationDialog'
import * as Thunks from '../thunks'
import { cry } from 'thor-devkit'
import './login.css'

class Login extends React.Component<any> {
    public state = {
        value: '',
        isErrorDialogOpen: false
    }

    private login = () => {
        this.props
            .dispatch(Thunks.login(this.state.value, '', ''))
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

    private generateMnemonic = () => {
        let mnemonic = cry.mnemonic.generate().join(' ')
        this.setState({ value: mnemonic })
    }

    private isValidCredentials = () => this.state.value.length > 0

    private loginWithKeyPress = ev => {
        if (ev.key === 'Enter') {
            this.onLoginListener(ev)
        }
    }

    private onCloseErrorDialogListener = () =>
        this.setState({ isErrorDialogOpen: false })

        public onLoginListener = e => {
        e.preventDefault()
        if (this.isValidCredentials()) {
            this.login()
        }
    }

    private onLoginTextChangedListener = event =>
        this.setState({ value: event.target.value })

        public onStageChangeListener = async event => {
        // await this.props.dispatch(Thunks.setCurrentStage(event.target.value))
        setTimeout(() => {
            location.reload(true)
        }, 500)
    }

    private renderErrorDialog = () => (
        <ConfirmationDialog
            onClick={this.onCloseErrorDialogListener}
            onClose={this.onCloseErrorDialogListener}
            title="Invalid Login"
            message="Please make sure you're entering a valid Private Key or Passphase"
            open={this.state.isErrorDialogOpen}
        />
    )

    private renderCard = () => (
        <Card>
            <LoginInner
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

    public render() {
        return (
            <div className="login">
                <Grid container={true} spacing={24} direction="column">
                    <Grid
                        container={true}
                        item={true}
                        spacing={0}
                        justify="center"
                    >
                        <Grid item={true} xs={12} md={6}>
                            <Paper>
                                {this.renderCard()}
                                {this.renderErrorDialog()}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

// Connect this component to Redux
export default connect(state => state)(Login)
