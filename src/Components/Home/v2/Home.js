/**
 * Created by user on 6/25/2017.
 */

import React, {Component} from 'react'

const WOW = require('wowjs');

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Card, {CardMedia, CardTitle, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'

import Footer from '../../Base/Footer/v2/Footer'
import Helper from '../../Helper'
import Navbar from '../../Base/Navbar/v2/Navbar'
import Themes from '../../Base/Themes'

const constants = require('./../../Constants')
const helper = new Helper()
const themes = new Themes()

import './home.css'

const styles = {
    card: {
        borderRadius: 10,
        minHeight: 400,
        cursor: 'pointer',
        backgroundColor: '#1d232f'
    }
}

class Home extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="home">
                    <Navbar
                        active={ constants.LINK_HOME }
                    />
                    <div className="cover">
                        <div className="container">
                            <div className="row">
                                <div className="col-5">
                                    <div className="row slogan">
                                        <div className="col">
                                            <h1>BE PART OF THE <span className="game">GAME</span></h1>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col pl-4">
                                            <p>DECENT.BET is a transparent and verifiable betting platform powered by
                                                the Ethereum
                                                Blockchain. Your in-house casino from anywhere in the world. </p>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col pl-4">
                                            <button className="btn btn-outline-primary">
                                                READ MORE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1">
                                </div>
                                <div className="col-6">
                                    <img className="globe mr-auto" src="assets/img/overlays/globe.png"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="benefits">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center">PLATFORM BENEFITS</h3>
                                    <hr/>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon" src="assets/img/icons/v2/share.png"/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Purchase House Shares</p>
                                            <p>Buy shares into the house for DBETs. Your DBETs get deposited into the
                                                house
                                                and
                                                in return
                                                you return shares for the amount of DBETs that were deposited.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon" src="assets/img/icons/v2/safe.png"/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Lock up DBETs for a Quarter</p>
                                            <p>Your DBETs are now locked up for a quarter and used as funds to hedge
                                                against
                                                bets placed by users. Shares can be placed anytime for sale in our share
                                                exchange and could be traded for DBETs.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon" src="assets/img/icons/v2/lottery.png"/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Have a chance at the lottery</p>
                                            <p>20% of all profits generated by the house will automatically be used to
                                                fund
                                                a
                                                lottery,
                                                which will select a shareholder at random and award them their
                                                winnings.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon" src="assets/img/icons/v2/earnings.png"/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Receive Quarterly Returns</p>
                                            <p>At the end of every quarter, profits generated would be calculated by the
                                                house
                                                and distributed to all share holders depending on the size of shares
                                                that
                                                they
                                                own. This would be trigger through a smart contract, ensuring
                                                transparency
                                                and
                                                trust.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ico">
                        <div className="row">
                            <div className="col-6 offset-3 countdown">
                                <div className="row">
                                    <div className="col-3 br">
                                        <h1>12</h1>
                                        <h5>DAYS</h5>
                                    </div>
                                    <div className="col-3 br">
                                        <h1>06</h1>
                                        <h5>HOURS</h5>
                                    </div>
                                    <div className="col-3 br">
                                        <h1>11</h1>
                                        <h5>MINUTES</h5>
                                    </div>
                                    <div className="col-3">
                                        <h1>23</h1>
                                        <h5>SECONDS</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row start">
                            <div className="col-2 offset-5">
                                <div className="triangle">
                                    <p className="text-center">ICO STARTS IN</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="games">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h4 className="text-center">GAMES ON OFFER</h4>
                                    <hr/>
                                </div>
                            </div>
                            <div className="row available">
                                <div className="col-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5}>
                                        <div className="offer-game sports-betting">
                                            <h5 className="text-center">SPORTS BETTING</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5}>
                                        <div className="offer-game slots">
                                            <h5 className="text-center">SLOTS</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5}>
                                        <div className="offer-game craps">
                                            <h5 className="text-center">CRAPS</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5}>
                                        <div className="offer-game roulette">
                                            <h5 className="text-center">ROULETTE</h5>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="signup">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="text-center">
                                    BE PART OF THE GAME
                                </h2>
                                <h6 className="text-center mt-2">
                                    AMAZING GAMES JUST FOR YOU
                                </h6>
                            </div>
                            <div className="col-12 mt-4">
                                <button className="btn btn-primary">
                                    SIGN UP
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer active={constants.LINK_HOME}/>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Home