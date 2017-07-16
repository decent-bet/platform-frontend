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
                                <div className="col-5">
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
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/share.png"}/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Purchase House Shares</p>
                                            <p>Buy shares into the house for DBETs. Your DBETs get deposited into
                                                the
                                                house
                                                and
                                                in return
                                                you return shares for the amount of DBETs that were deposited.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/safe.png"}/>
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
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/lottery.png"}/>
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
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/earnings.png"}/>
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
                            <div className="col-8 col-md-6 offset-2 offset-md-3 countdown">
                                <div className="row">
                                    <div className="col-3 br">
                                        <h1>??</h1>
                                        <h5>DAYS</h5>
                                    </div>
                                    <div className="col-3 br">
                                        <h1>??</h1>
                                        <h5>HOURS</h5>
                                    </div>
                                    <div className="col-3 br">
                                        <h1>??</h1>
                                        <h5>MINUTES</h5>
                                    </div>
                                    <div className="col-3">
                                        <h1>??</h1>
                                        <h5>SECONDS</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row start">
                            <div className="col-2 offset-4 offset-md-5">
                                <div className="triangle">
                                    <p className="text-center">ICO TO BE ANNOUNCED</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="why">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center">WHY DECENT.BET?</h3>
                                    <hr/>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/transparency.png"}/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Transparency</p>
                                            <p>Being hosted on smart contracts on the Ethereum
                                                Blockchain, users can
                                                look through
                                                our contract source code as well as track any transaction made on the
                                                contract to ensure
                                                <span className="logo-text"> decent.bet</span> stays fair and relies on
                                                trustworthy game outcomes and does not cheat it's users. </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/house.png"}/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Be the house</p>
                                            <p>Bets placed by users will always have the house to hedge against their
                                                bets -
                                                users can buy into the house funds and receive a split of the profits at
                                                the
                                                end of every quarter. Moreover, shares into the house can be traded at
                                                any time
                                                with other users for any convenient price for liquidity.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/decentc.png"}/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">Decent.C</p>
                                            <p><span className="logo-text">decent.bet</span> allots 20% of all collected
                                                profits and donates them to needy causes and charities around the world.
                                                All
                                                charitable donations will be transparent and registered on the
                                                blockchain to ensure honesty and trustworthiness.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/whitelabel.png"}/>
                                        </div>
                                        <div className="col-8">
                                            <p className="header">White Label</p>
                                            <p>After Year 2, <span className="logo-text">decent.bet</span> will open
                                                it's
                                                API and custom houses on the platform for betting companies to join in
                                                the platform
                                                with custom lines and APIs. This would ultimately benefit users of the
                                                platform, by
                                                simply holding shares in the platform as share prices would shoot up
                                                with
                                                a larger user base joining in the long run.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="games">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center">GAMES ON OFFER</h3>
                                    <hr/>
                                </div>
                            </div>
                            <div className="row available">
                                <div className="col-12 col-md-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5} className="game-card">
                                        <div className="offer-game sports-betting">
                                            <h5 className="text-center">SPORTS BETTING</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-12 col-md-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5} className="game-card">
                                        <div className="offer-game slots">
                                            <h5 className="text-center">SLOTS</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-12 col-md-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5} className="game-card">
                                        <div className="offer-game craps">
                                            <h5 className="text-center">CRAPS</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-12 col-md-3 hvr-float-shadow">
                                    <Card style={styles.card} zDepth={5} className="game-card">
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