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
            balance: props.balance,
            amount: '',
            valid: {
                error: false,
                message: ''
            }
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open,
            sessionNumber: props.sessionNumber,
            allowance: props.allowance,
            balance: props.balance
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
                        let amount = parseInt(self.state.amount)
                        let balance = parseInt(self.state.balance)
                        console.log(amount, balance)
                        if (amount <= balance) {
                            self.props.onConfirm(self.state.amount)
                            self.toggleDialog(false)
                        } else {
                            self.setState({
                                valid: {
                                    error: true,
                                    message: amount ?
                                        'You do not have enough DBETs to purchase ' + amount + ' credits' :
                                        'Please enter a valid amount of DBETs'
                                }
                            })
                        }
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
                            {   self.state.valid.error &&
                            <section>
                                <small className="text-danger">
                                    { self.state.valid.message }
                                </small>
                                <br/>
                            </section>
                            }
                            <small className="color-gold">Available balance: {self.state.balance} DBETs
                            </small>
                            <br/>
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