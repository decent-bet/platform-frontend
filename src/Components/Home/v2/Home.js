/**
 * Created by user on 6/25/2017.
 */

import React, {Component} from 'react'

const Chart = require('chart.js')
const scrollToElement = require('scroll-to-element');
const WOW = require('wowjs');

import LinearProgress from 'material-ui/LinearProgress'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Card from 'material-ui/Card'

import DecentPrelaunchAPI from './../../Base/DecentPrelaunchAPI'
import Footer from '../../Base/Footer/v2/Footer'
import Helper from '../../Helper'
import Navbar from '../../Base/Navbar/v2/Navbar'
import Themes from '../../Base/Themes'

const constants = require('./../../Constants')
const decentPrelaunchApi = new DecentPrelaunchAPI()
const helper = new Helper()
const themes = new Themes()

import './../../Base/animations.css'
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
        this.state = {
            email: '',
            loading: false,
            errorMessage: '',
            successMessage: ''
        }
    }

    componentDidMount = () => {
        new WOW.WOW().init()
        this.initCharts()
    }

    initCharts = () => {
        let icoDistribution = document.getElementById("ico-distribution").getContext('2d')
        let icoUsage = document.getElementById("ico-usage").getContext('2d')

        new Chart(icoDistribution, {
            type: 'doughnut',
            data: {
                labels: ["Development (40%)", "Legal (15%)", "Marketing (25%)", "Operations (20%)"],
                datasets: [{
                    label: 'Distribution',
                    data: [40, 15, 25, 20],
                    backgroundColor: [
                        '#F2B45C',
                        '#D8A152',
                        '#72552C',
                        '#B28544'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                tooltips: true,
                cutoutPercentage: 75,
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 20,
                        padding: 30,
                        fontFamily: 'GothamLight',
                        fontSize: 13,
                        fontColor: '#ffffff'
                    }
                },
                title: {
                    display: true,
                    text: 'Distribution',
                    fontSize: 30,
                    fontColor: '#ffffff',
                    fontFamily: 'GothamMedium',
                    padding: 30
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        })

        new Chart(icoUsage, {
            type: 'doughnut',
            data: {
                labels: ["Crowdsale (70%)", "Team (18%)", "House Fund (10%)", "Bounties (2%)"],
                datasets: [{
                    label: 'Usage',
                    data: [70, 18, 10, 2],
                    backgroundColor: [
                        '#F2B45C',
                        '#D8A152',
                        '#72552C',
                        '#B28544'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                tooltips: true,
                cutoutPercentage: 75,
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 20,
                        padding: 30,
                        fontFamily: 'GothamLight',
                        fontSize: 13,
                        fontColor: '#ffffff'
                    }
                },
                title: {
                    display: true,
                    text: 'Usage',
                    fontSize: 30,
                    fontColor: '#ffffff',
                    fontFamily: 'GothamMedium',
                    padding: 30
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        })
    }

    subscribe = () => {
        const self = this
        self.toggleLoading(true)
        setTimeout(() => {
            if (this.state.email.length > 0) {
                decentPrelaunchApi.subscribe(this.state.email, (err, response) => {
                    self.toggleLoading(false)
                    if (err)
                        self.setErrorMessage('There was an error subscribing. Please try again in a few moments')
                    else if (response.error)
                        self.setErrorMessage('There was an error subscribing. ' +
                            'The e-mail is either invalid or may have already been added to the mailing list')
                    else {
                        self.setSuccessMessage('THANKS FOR SUBSCRIBING AND WELCOME TO THE DECENT.BET COMMUNITY!')
                    }
                })
            }
        }, 1000)
    }

    toggleLoading = (loading) => {
        this.setState({
            loading: loading
        })
    }

    setErrorMessage = (message) => {
        this.setState({
            errorMessage: message,
            successMessage: ''
        })
    }

    setSuccessMessage = (message) => {
        this.setState({
            successMessage: message,
            errorMessage: ''
        })
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="home">
                    <Navbar
                        active={ constants.LINK_HOME }
                    />
                    <div className="cover">
                        <div className="container">
                            <div className="row">
                                <div className="col-7 col-xs-6 col-md-5">
                                    <div className="row slogan">
                                        <div className="col">
                                            <h1>BE PART OF THE <span className="game">GAME</span></h1>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col pl-4">
                                            <p className="info">DECENT.BET is a transparent and verifiable sports
                                                betting and gambling
                                                game platform powered by
                                                the Ethereum
                                                Blockchain. Your in-house casino from anywhere in the world. </p>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col pl-4">
                                            <button className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        scrollToElement('#content');
                                                    }}>
                                                READ MORE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5 offset-md-1">
                                    <img className="globe mr-auto wow fadeIn" src="assets/img/overlays/globe.png"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="benefits" id="content">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center wow slideInUp">PLATFORM BENEFITS</h3>
                                    <hr/>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/share.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">Purchase House Shares</p>
                                            <p className="info">Buy shares into the house for DBETs. Your DBETs get
                                                deposited into
                                                the
                                                house
                                                and
                                                in return
                                                you return shares for the amount of DBETs that were deposited.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/safe.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">Lock up DBETs for a Quarter</p>
                                            <p className="info">Your DBETs are now locked up for a quarter and used as
                                                funds to hedge
                                                against
                                                bets placed by users. Shares can be placed anytime for sale in our share
                                                exchange and could be traded for DBETs.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/lottery.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">Have a chance at the lottery</p>
                                            <p className="info">20% of all profits generated by the house will
                                                automatically be used to
                                                fund
                                                a
                                                lottery,
                                                which will select a shareholder at random and award them their
                                                winnings.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/earnings.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">Receive Quarterly Returns</p>
                                            <p className="info">At the end of every quarter, profits generated would be
                                                calculated by the
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
                            <div className="col-10 col-md-6 offset-1 offset-md-3 countdown wow fadeIn">
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
                                <div className="triangle wow fadeInUp">
                                    <p className="text-center">ICO TO BE ANNOUNCED</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="why">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center wow fadeInUp">WHY DECENT.BET?</h3>
                                    <hr/>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/transparency.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">Transparency</p>
                                            <p className="info">Being hosted on smart contracts on the Ethereum
                                                Blockchain, users can
                                                look through
                                                our contract source code as well as track any transaction made on the
                                                contract to ensure
                                                <span className="logo-text"> Decent.bet</span> stays fair and relies on
                                                accurate game outcomes and does not cheat it's users. </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/house.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">Be the house</p>
                                            <p className="info">Bets placed by users will always the house to hedge
                                                against their
                                                bets -
                                                users can buy into the house funds and receive a split of the profits at
                                                the
                                                end of every quarter. Moreover, shares into the house will be tradeable
                                                at
                                                any time
                                                with other users for any convenient price for liquidity.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row points">
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/decentc.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">Decent.C</p>
                                            <p className="info"><span className="logo-text">Decent.bet</span> allots 10%
                                                of
                                                profits generated by the founder's shares in the house and donates them
                                                to needy causes and charities around the world.
                                                All charitable donations will be transparent and registered on the
                                                blockchain to maintain complete transparency.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 wow fadeIn">
                                    <div className="row">
                                        <div className="col-2">
                                            <img className="icon"
                                                 src={process.env.PUBLIC_URL + "assets/img/icons/v2/whitelabel.png"}/>
                                        </div>
                                        <div className="col-9">
                                            <p className="header">White Label</p>
                                            <p className="info"><span className="logo-text">Decent.bet</span> will open
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
                                <div className="col-12 col-md-3 hvr-float-shadow wow fadeIn">
                                    <Card style={styles.card} zDepth={5} className="game-card">
                                        <div className="offer-game sports-betting">
                                            <h5 className="text-center">SPORTS BETTING</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-12 col-md-3 hvr-float-shadow wow fadeIn">
                                    <Card style={styles.card} zDepth={5} className="game-card">
                                        <div className="offer-game slots">
                                            <h5 className="text-center">SLOTS</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-12 col-md-3 hvr-float-shadow wow fadeIn">
                                    <Card style={styles.card} zDepth={5} className="game-card">
                                        <div className="offer-game craps">
                                            <h5 className="text-center">CRAPS</h5>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-12 col-md-3 hvr-float-shadow wow fadeIn">
                                    <Card style={styles.card} zDepth={5} className="game-card">
                                        <div className="offer-game roulette">
                                            <h5 className="text-center">ROULETTE</h5>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="distribution">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center wow fadeInDown">ICO DETAILS</h3>
                                    <hr/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6 wow fadeIn">
                                    <canvas id="ico-distribution" width="400" height="400"/>
                                </div>
                                <div className="col-12 col-md-6 wow fadeIn">
                                    <canvas id="ico-usage" width="400" height="400"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="signup">
                        <div className="row wow fadeIn">
                            <div className="col-12">
                                <div>
                                    <h2 className="text-center">
                                        SUBSCRIBE TO THE DECENT.BET NEWSLETTER
                                    </h2>
                                    <h6 className="text-center mt-4">
                                        AND GET UPDATES ON THE ICO, CONFERENCES, DEVELOPMENT AND MORE
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 mt-4">
                                {   !self.state.loading &&
                                <div className="container mt-2">
                                    <div className="row">
                                        <div className="col-12 col-md-4 offset-md-3">
                                            <input type="email"
                                                   placeholder="YOUR EMAIL"
                                                   value={self.state.email}
                                                   onKeyPress={(target) => {
                                                       if (target.charCode == 13)
                                                           self.subscribe()
                                                   }}
                                                   onChange={(event) => {
                                                       self.setState({
                                                           email: event.target.value,
                                                           successMessage: '',
                                                           errorMessage: ''
                                                       })
                                                   }}
                                            />
                                        </div>
                                        <div className="col-12 col-md-2 mt-3 mt-md-0">
                                            <button className="btn btn-primary" onClick={() => {
                                                self.subscribe()
                                            }}>
                                                SIGN UP
                                            </button>
                                        </div>
                                        <div className="col-12 mt-2">
                                            <p className="text-center error-message animated fadeIn">{self.state.errorMessage}</p>
                                            <p className="text-center success-message animated fadeIn">{self.state.successMessage}</p>
                                        </div>
                                    </div>
                                </div>
                                }
                                {   self.state.loading &&
                                <div className="row loading">
                                    <LinearProgress mode="indeterminate" color={constants.COLOR_GOLD}/>
                                </div>
                                }
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