/**
 * Created by user on 10/2/2017.
 */

import React, {Component} from 'react'

import {Dialog, FlatButton, TextField} from 'material-ui'

const styles = require('../../../../Base/DialogStyles').styles

const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')

class NewChannelDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            deposit: ''
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open
        })
    }

    toggleDialog = (enabled) => {
        this.props.toggleDialog(enabled)
    }

    render() {
        const self = this
        return <Dialog
            title="New Channel"
            titleStyle={styles.titleStyle}
            actions={<FlatButton
                label="Create Channel"
                labelStyle={styles.floatingLabelStyle}
                primary={true}
                onClick={ () => {
                    if (self.state.deposit.length > 0 &&
                        parseInt(self.state.deposit) >= constants.SLOTS_CHANNEL_DEPOSIT_MIN &&
                        parseInt(self.state.deposit) <= constants.SLOTS_CHANNEL_DEPOSIT_MAX)
                        self.props.onCreateChannel(ethUnits.convert(self.state.deposit, 'ether', 'wei'))
                }}
            />
            }
            modal={false}
            open={self.state.open}
            onRequestClose={() => {
                self.toggleDialog(false)
            }}>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <TextField
                            floatingLabelText="Deposit Amount"
                            fullWidth={true}
                            hintStyle={{color: '#949494'}}
                            inputStyle={styles.inputStyle}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            underlineDisabledStyle={styles.underlineDisabledStyle}
                            type="number"
                            value={self.state.deposit}
                            onChange={(event, value) => {
                                self.setState({
                                    deposit: value
                                })
                            }}
                        />
                        <small className="text-white">Enter the amount of DBETs you would like to deposit
                            into the new slots channel (100 - 1000 DBETs).
                        </small>
                    </div>
                </div>
            </div>
        </Dialog>
    }

}

export default NewChannelDialog