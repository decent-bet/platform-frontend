import React, { Component, Fragment } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { MuiThemeProvider, Snackbar, CircularProgress } from 'material-ui'
import { Provider } from 'react-redux'
import store from '../../../Model/store'
import Dashboard from '../Dashboard'
import Login from '../Login'
import PrivateRoute from './PrivateRoute'
import LogoutRoute from './LogoutRoute'
import EventBus from 'eventing-bus'
import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import { MainTheme, SnackbarTheme } from '../../Base/Themes'
import { VIEW_LOGIN } from '../../Constants'

export default class App extends Component {
    state = {
        snackbarMessage: null,
        isSnackBarOpen: false,
        stateMachine: 'loading'
    }

    componentWillMount = () => {
        EventBus.on('showSnackbar', message => {
            this.setState({
                isSnackBarOpen: true,
                snackbarMessage: message
            })
        })

        if (window.web3Loaded) {
            this.initWeb3Data()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.setState({ stateMachine: 'loaded' })
                // Unregister callback
                web3Loaded()
            })

            // Listen for error state
            let web3NotLoaded = EventBus.on('web3NotLoaded', () => {
                this.setState({ stateMachine: 'error' })
                web3NotLoaded()
            })
        }
    }

    renderSnackBar = () => {
        if (this.state.snackbarMessage) {
            return (
                <MuiThemeProvider muiTheme={SnackbarTheme}>
                    <Snackbar
                        message={this.state.snackbarMessage}
                        open={this.state.isSnackBarOpen}
                        autoHideDuration={6000}
                    />
                </MuiThemeProvider>
            )
        } else {
            return null
        }
    }

    renderStateLoaded = () => (
        <Fragment>
            <BrowserRouter>
                <Switch>
                    <LogoutRoute path={VIEW_LOGIN} component={Login} />
                    <PrivateRoute component={Dashboard} />
                </Switch>
            </BrowserRouter>

            {this.renderSnackBar()}
        </Fragment>
    )

    renderStateError = () => (
        <ConfirmationDialog
            open={true}
            title="Not connected to Web3 Provider"
            message={
                "Looks like you aren't connected to a local node. " +
                'Please setup a local node with an open RPC port @ 8545 and try again.'
            }
        />
    )

    renderStateLoading = () => <CircularProgress />

    renderInner = () => {
        switch (this.state.stateMachine) {
            case 'loaded':
                return this.renderStateLoaded()

            case 'loading':
                return this.renderStateLoading()

            case 'error':
                return this.renderStateError()

            default:
                return null
        }
    }

    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider muiTheme={MainTheme}>
                    {this.renderInner()}
                </MuiThemeProvider>
            </Provider>
        )
    }
}
