import React, { Component, Fragment } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { MuiThemeProvider, Snackbar } from 'material-ui'
import { Provider } from 'react-redux'
import store from '../../../Model/store'
import Dashboard from '../Dashboard'
import Login from '../Login'
import PrivateRoute from './PrivateRoute'
import LogoutRoute from './LogoutRoute'
import EventBus from 'eventing-bus'
import { MainTheme, SnackbarTheme } from '../../Base/Themes'

const constants = require('../../Constants')

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            snackbarMessage: null,
            isSnackBarOpen: false
        }
    }

    componentWillMount = () => {
        EventBus.on('showSnackbar', message => {
            this.setState({
                isSnackBarOpen: true,
                snackbarMessage: message
            })
        })
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
            return <span />
        }
    }

    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider muiTheme={MainTheme}>
                    <Fragment>
                        <BrowserRouter>
                            <Switch>
                                <LogoutRoute
                                    path={constants.VIEW_LOGIN}
                                    component={Login}
                                />
                                <PrivateRoute component={Dashboard} />
                            </Switch>
                        </BrowserRouter>

                        {this.renderSnackBar()}
                    </Fragment>
                </MuiThemeProvider>
            </Provider>
        )
    }
}
