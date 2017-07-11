/**
 * Created by user on 4/28/2017.
 */

import React, {Component} from 'react'

const WOW = require('wowjs');

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Footer from '../Base/Footer/v1/Footer'
import Themes from './../Base/Themes'

import Helper from './../Helper'

const helper = new Helper()
const themes = new Themes()
const constants = require('./../Constants')

import Navbar from '../Base/Navbar/v1/Navbar'

import './roadmap.css'

const styles = {
    cardHeader: {
        borderRadius: 30,
        height: 35,
        width: 200,
        cursor: 'pointer'
    },
    card: {
        borderRadius: 10
    }
}

class Roadmap extends Component {

    constructor(props) {
        super(props)
        new WOW.WOW().init();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div>
                    <Navbar
                        active={ constants.LINK_ROADMAP }
                    />
                    <div className="cover">
                        <h1 className="text-center">Roadmap</h1>
                        <hr className="green-div"/>
                        <div className="container mt-5">
                            <div className="row">
                                <div className="col">
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <Footer />
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Roadmap