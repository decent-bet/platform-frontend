import React, {Component} from 'react'
import {Dialog, FlatButton, MuiThemeProvider} from 'material-ui'
import {DialogTheme} from '../Themes'

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
                <MuiThemeProvider muiTheme={DialogTheme}>
                    <Dialog
                        title={self.props.title}
                        actions={<FlatButton
                            label="Ok"
                            primary={false}
                            onTouchTap={self.props.onClick}/>
                        }
                        modal={false}
                        open={this.state.open}
                        autoScrollBodyContent={false}
                        onRequestClose={self.props.onClose}
                    >
                        <p>{self.state.message}</p>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }

}

export default ConfirmationDialog