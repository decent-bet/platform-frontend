/**
 * Created by user on 7/28/2017.
 */

import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {Dialog, FlatButton} from 'material-ui'
import Themes from './Themes'

const constants = require('../Constants')
const themes = new Themes()

class ConfirmationDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message: props.message,
            open: props.open
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            title: nextProps.title,
            message: nextProps.message,
            open: nextProps.open
        })
    }

    render() {
        const self = this
        return (
            <div>
                <MuiThemeProvider muiTheme={themes.getDialog()}>
                    <Dialog
                        title={self.props.title}
                        titleStyle={{
                            color: constants.COLOR_GOLD
                        }}
                        actions={<FlatButton
                            label="Ok"
                            primary={true}
                            onTouchTap={self.props.onClick}/>
                        }
                        modal={false}
                        open={this.state.open}
                        onRequestClose={self.props.onClose}>
                        <p>{self.state.message}</p>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }

}

export default ConfirmationDialog