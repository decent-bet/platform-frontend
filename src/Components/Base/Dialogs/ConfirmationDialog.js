import React, { Component } from 'react'
import { Dialog, FlatButton, MuiThemeProvider } from 'material-ui'
import { DialogTheme } from '../Themes'

class ConfirmationDialog extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={DialogTheme}>
                <Dialog
                    title={this.props.title}
                    actions={
                        <FlatButton
                            label="Ok"
                            primary={false}
                            onTouchTap={this.props.onClick}
                        />
                    }
                    modal={false}
                    open={this.props.open}
                    autoScrollBodyContent={false}
                    onRequestClose={this.props.onClose}
                >
                    <p>{this.props.message}</p>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

export default ConfirmationDialog
