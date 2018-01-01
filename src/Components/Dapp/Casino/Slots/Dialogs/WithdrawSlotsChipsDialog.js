import React, {Component} from 'react'

import {Dialog, CircularProgress, FlatButton, MuiThemeProvider, TextField} from 'material-ui'
import Themes from '../../../../Base/Themes'

const styles = require('../../../../Base/DialogStyles').styles
const themes = new Themes()

const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')

class WithdrawSlotsChipsDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            balance: props.balance,
            amount: ''
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open,
            balance: props.balance
        })
    }

    toggleDialog = (enabled) => {
        this.props.toggleDialog(enabled)
    }

    views = () => {
        return {
            tinyLoader: () => {
                return <CircularProgress color={constants.COLOR_GOLD} size={18}/>
            }
        }
    }

    render() {
        const self = this
        return <Dialog
            title="Withdraw Slots Chips"
            titleStyle={styles.titleStyle}
            actions={
                <MuiThemeProvider muiTheme={themes.getButtons()}>
                    <FlatButton
                        label="Get Chips"
                        primary={true}
                        disabled={self.state.amount.length == 0}
                        onClick={ () => {
                            if (self.state.amount.length > 0)
                                self.props.onWithdrawChips(ethUnits.convert(self.state.amount, 'ether', 'wei').toString())
                        }}
                    />
                </MuiThemeProvider>
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
                            floatingLabelText="Amount of Chips"
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
                        <small className="text-white">
                            Enter the amount of chips you would like to withdraw from the
                            Slots Manager Contract.
                        </small>
                        <br/>
                        <small className="color-gold">
                            Available slots chips: {self.state.balance != null ?
                            self.state.balance : self.views().tinyLoader()} DBETs
                        </small>
                    </div>
                </div>
            </div>
        </Dialog>
    }

}

export default WithdrawSlotsChipsDialog