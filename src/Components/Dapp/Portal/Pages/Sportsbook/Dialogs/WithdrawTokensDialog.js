import React, {Component} from 'react'
import {Dialog, FlatButton, MuiThemeProvider, TextField} from 'material-ui'
import { DialogTheme } from '../../../../../Base/Themes'

const styles = require('../../../../../Base/DialogStyles').styles

class WithdrawTokensDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            sessionNumber: props.sessionNumber,
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
            balance: props.balance
        })
    }

    toggleDialog = (enabled) => {
        this.props.toggleDialog(enabled)
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={DialogTheme}>
                <Dialog
                    title={"WITHDRAW TOKENS FOR SESSION " + self.state.sessionNumber}
                    titleStyle={styles.titleStyle}
                    actions={<FlatButton
                        label="Withdraw"
                        primary={true}
                        disabled={self.state.amount.length == 0 || parseInt(self.state.amount) == 0}
                        onClick={() => {
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
                                            'Ammount is greater than available DBETs. Please enter a valid amount and try again.' :
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
                                {self.state.valid.error &&
                                <section>
                                    <small className="text-danger">
                                        { self.state.valid.message }
                                    </small>
                                    <br/>
                                </section>
                                }
                                <small className="color-gold">Available balance: {self.state.balance} DBETs</small>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

export default WithdrawTokensDialog