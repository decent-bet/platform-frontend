/**
 * Created by user on 7/28/2017.
 */

import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import Themes from './Themes'
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
                <MuiThemeProvider muiTheme={themes.getAppBar()}>
                    <Dialog
                        title={self.props.title}
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