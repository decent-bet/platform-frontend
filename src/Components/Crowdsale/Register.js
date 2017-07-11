/**
 * Created by user on 4/28/2017.
 */

import React, {Component} from 'react'

import Card, {CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const WOW = require('wowjs');

import Helper from './../Helper'

const helper = new Helper()
const constants = require('./../Constants')

import './register.css'

const styles = {
    card: {
        borderRadius: 10,
        height: 450,
        padding: 30
    },
    underlineStyle: {
        borderColor: constants.COLOR_ACCENT,
    },
    floatingLabelStyle: {
        color: constants.COLOR_ACCENT
    }
}

class Register extends Component {

    constructor(props) {
        super(props)
        new WOW.WOW().init();
    }

    render() {
        const self = this
        return (
            <div className="register-div row">
                <div className="col-6 offset-3">
                    <Card zDepth={3} style={ styles.card }>
                        <div className="text-center">
                            <h3>Enter credentials for your new account</h3>
                            <TextField
                                style={{width: '100%'}}
                                type="emailAddress"
                                floatingLabelText="E-mail Address"
                                floatingLabelStyle={ styles.floatingLabelStyle }
                                underlineStyle={ styles.underlineStyle }
                                underlineFocusStyle={ styles.underlineStyle }
                            /><br />
                            <TextField
                                className="mt-2"
                                style={{width: '100%'}}
                                type="password"
                                floatingLabelText="Password"
                                floatingLabelStyle={ styles.floatingLabelStyle }
                                underlineStyle={ styles.underlineStyle }
                                underlineFocusStyle={ styles.underlineStyle }
                            /><br />
                            <TextField
                                className="mt-2"
                                style={{width: '100%'}}
                                type="password"
                                floatingLabelText="Confirm Password"
                                floatingLabelStyle={ styles.floatingLabelStyle }
                                underlineStyle={ styles.underlineStyle }
                                underlineFocusStyle={ styles.underlineStyle }
                            /><br />
                            <p className="mt-2">Already have an account?
                                <a href="#" className="login" onClick={() => {
                                    self.props.switchToLogin()
                                }}> Login</a>
                            </p>
                            <RaisedButton
                                className="mt-2"
                                label="Register"
                                backgroundColor={ constants.COLOR_ACCENT}
                                labelColor={ constants.COLOR_WHITE }
                            />
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

}

export default Register