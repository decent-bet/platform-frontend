import React, { Component, Fragment } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { MuiThemeProvider, Snackbar } from 'material-ui'
import Dashboard from '../Dashboard'
import Login from '../Login'
import PrivateRoute from './PrivateRoute'
import LogoutRoute from './LogoutRoute'
import EventBus from 'eventing-bus'
import Themes from '../../Base/Themes'

const constants = require('../../Constants')
const themes = new Themes()

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
                <MuiThemeProvider muiTheme={themes.getSnackbar()}>
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
        )
    }
}
