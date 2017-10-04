/**
 * Created by user on 10/2/2017.
 */

import React, {Component} from 'react'

import {Dialog, CircularProgress, FlatButton, TextField} from 'material-ui'
const styles = require('../../../../Base/DialogStyles').styles

const constants = require('../../../../Constants')
const ethUnits = require('ethereum-units')

class GetSlotsChipsDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            allowance: props.allowance,
            amount: ''
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open,
            allowance: props.allowance
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
            title="Get Slots Chips"
            titleStyle={styles.titleStyle}
            actions={<FlatButton
                label="Get Chips"
                labelStyle={styles.floatingLabelStyle}
                primary={true}
                onClick={ () => {
                    if (self.state.amount.length > 0)
                        self.props.onGetChips(ethUnits.convert(self.state.amount, 'ether', 'wei'))
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
                        <small className="text-white">Enter the amount of DBETs you would like to exchange for slots
                            chips. If you haven't set enough slot allowance to cover the chips amount, an additional
                            transaction will be made to set the allowance.
                        </small>
                        <br/>
                        <small className="color-gold">Current slots allowance: {self.state.allowance != null ?
                            ethUnits.convert(self.state.allowance, 'wei', 'ether').toString() :
                            self.views().tinyLoader()} DBETs
                        </small>
                    </div>
                </div>
            </div>
        </Dialog>
    }

}

export default GetSlotsChipsDialog