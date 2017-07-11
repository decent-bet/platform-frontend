/**
 * Created by user on 4/28/2017.
 */

import React, {Component} from 'react'

import Card, {CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const WOW = require('wowjs');

import Register from './Register'

import Helper from './../Helper'

const helper = new Helper()
const constants = require('./../Constants')

import './login.css'

const styles = {
    card: {
        borderRadius: 10,
        height: 350,
        padding: 30
    },
    underlineStyle: {
        borderColor: constants.COLOR_ACCENT,
    },
    floatingLabelStyle: {
        color: constants.COLOR_ACCENT
    }
}

class Login extends Component {

    constructor(props) {
        super(props)
        new WOW.WOW().init();
        this.state = {
            login: true
        }
    }

    render() {
        const self = this
        return (
            <div className="login-div">
                {   !self.state.login &&
                <Register
                    switchToLogin={() => {
                        self.setState({
                            login: true
                        })
                    }}/>
                }
                {   self.state.login &&
                <div className="row">
                    <div className="col-6 offset-3">
                        <Card zDepth={3} style={ styles.card }>
                            <div className="text-center">
                                <h3>Enter your credentials</h3>
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
                                <p className="mt-3">Don't have an account?
                                    <a href="#" className="register"
                                       onClick={ () => {
                                           self.setState({
                                               login: false
                                           })
                                       }}> Register</a>
                                </p>
                                <RaisedButton
                                    className="mt-2"
                                    label="Login"
                                    backgroundColor={ constants.COLOR_ACCENT}
                                    labelColor={ constants.COLOR_WHITE }
                                    onClick={() => {
                                        helper.mockLogin()
                                        self.props.onLogin()
                                    }}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
                }
            </div>
        )
    }

}

export default Login