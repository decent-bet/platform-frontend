/**
 * Created by user on 8/21/2017.
 */

import React, {Component} from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

const styles = require('./../../../Base/DialogStyles').styles

class PurchaseCreditsDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            sessionNumber: props.sessionNumber,
            allowance: props.allowance,
            amount: ''
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open,
            sessionNumber: props.sessionNumber,
            allowance: props.allowance,
        })
    }

    toggleDialog = (enabled) => {
        this.props.toggleDialog(enabled)
    }

    render() {
        const self = this
        return (
            <Dialog
                title={"PURCHASE CREDITS FOR SESSION " + self.state.sessionNumber}
                titleStyle={styles.titleStyle}
                actions={<FlatButton
                    label="Purchase"
                    labelStyle={styles.floatingLabelStyle}
                    primary={true}
                    onClick={ () => {
                        self.props.onConfirm(self.state.amount)
                    }}
                />
                }
                modal={false}
                open={self.state.open}
                onRequestClose={() => {
                    this.toggleDialog(false)
                }}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <TextField
                                floatingLabelText="Amount"
                                fullWidth={true}
                                hintStyle={{color: '#949494'}}
                                inputStyle={styles.inputStyle}
                                floatingLabelStyle={styles.floatingLabelStyle}
                                floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                underlineStyle={styles.underlineStyle}
                                underlineFocusStyle={styles.underlineStyle}
                                underlineDisabledStyle={styles.underlineDisabledStyle}
                                type="number"
                                value={self.state.amount}
                                onChange={(event, value) => {
                                    self.setState({
                                        amount: value
                                    })
                                }}
                            />
                            <small className="text-white">Please note that if you haven't set an allowance for the house
                                to transfer DBETs to it's contract address, you will be prompted to do so now and will
                                have to send 2 transactions to the network.
                            </small>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }

}

export default PurchaseCreditsDialog