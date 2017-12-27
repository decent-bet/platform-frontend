import React, {Component} from 'react'

import {MuiThemeProvider, Snackbar} from 'material-ui'

import EventBus from 'eventing-bus'
import Themes from '../Base/Themes'

const themes = new Themes()

class App extends Component {

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
        EventBus.on('showSnackbar', (message) => {
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
                self.setState(Object.assign(self.state.snackbar, {
                    open: open,
                    message: message
                }))
            }
        }
    }

    views = () => {
        const self = this
        return {
            snackbar: () => {
                return <MuiThemeProvider muiTheme={themes.getSnackbar()}>
                    <Snackbar
                        message={self.state.snackbar.message}
                        open={self.state.snackbar.open}
                        autoHideDuration={6000}
                    />
                </MuiThemeProvider>
            }
        }
    }

    render() {
        const self = this
        return <div>
            {this.props.children}
            { self.views().snackbar() }
        </div>
    }

}

export default App