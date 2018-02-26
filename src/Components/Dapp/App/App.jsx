import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider, Snackbar } from 'material-ui'
import Dashboard from '../Dashboard/Dashboard'
import Login from '../Login/Login'
import PrivateRoute from './PrivateRoute'
import EventBus from 'eventing-bus'
import Themes from '../../Base/Themes'

const constants = require('../../Constants')
const themes = new Themes()

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            snackbar: {
                open: false,
                message: null
            }
        }
    }

    componentWillReceiveProps = () => {
        this.helpers().toggleSnackbar(false, null)
    }

    componentWillMount = () => {
        const self = this
        EventBus.on('showSnackbar', message => {
            self.helpers().toggleSnackbar(true, message)
        })
    }

    helpers = () => {
        const self = this
        return {
            toggleSnackbar: (open, message) => {
                let snackbar = self.state.snackbar
                snackbar.open = open
                snackbar.message = message
                self.setState(
                    Object.assign(self.state.snackbar, {
                        open: open,
                        message: message
                    })
                )
            }
        }
    }

    renderSnackBar = () => {
        if (this.state.snackbar.message) {
            return (
                <MuiThemeProvider muiTheme={themes.getSnackbar()}>
                    <Snackbar
                        message={this.state.snackbar.message}
                        open={this.state.snackbar.open}
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
            <Fragment>
                <BrowserRouter>
                    <Switch>
                        <Route
                            exact
                            path={constants.VIEW_LOGIN}
                            component={Login}
                        />
                        <PrivateRoute component={Dashboard} />
                    </Switch>
                </BrowserRouter>

                {this.renderSnackBar()}
            </Fragment>
        )
    }
}
