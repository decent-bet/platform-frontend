/**
 * Created by user on 4/28/2017.
 */

import React, {Component} from 'react'

const WOW = require('wowjs');

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Card, {CardMedia, CardTitle, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'

import Footer from '../../Base/Footer/v1/Footer'
import Themes from '../../Base/Themes'

import Helper from '../../Helper'

const helper = new Helper()
const themes = new Themes()
const constants = require('./../../Constants')

import Navbar from '../../Base/Navbar/v1/Navbar'

import '../../Base/animations.css'
import '../../Base/utils.css'
import './home.css'

import BitcoinTalk from '../../Icons/social/bitcoin'
import Facebook from '../../Icons/social/facebook'
import Medium from '../../Icons/social/medium'
import Reddit from '../../Icons/social/reddit'
import Slack from '../../Icons/social/slack'
import Twitter from '../../Icons/social/twitter'

const styles = {
    cardHeader: {
        borderRadius: 30,
        height: 35,
        width: 200,
        cursor: 'pointer'
    },
    card: {
        borderRadius: 10,
        minHeight: 400,
        cursor: 'pointer',
        backgroundColor: '#ffffff'
    },
    reason: {
        borderRadius: 2,
        padding: '45px 0 15px 0',
        cursor: 'pointer',
        backgroundColor: '#5278d3'
    },
    social: {
        icons: {
            height: 72,
            width: 72,
            cursor: 'pointer'
        }
    },
    textField: {
        marginRight: 40
    },
    errorStyle: {
        color: constants.COLOR_RED
    },
    underlineStyle: {
        borderColor: constants.COLOR_RED
    },
    floatingLabelStyle: {
        color: constants.COLOR_RED
    },
    floatingLabelFocusStyle: {
        color: constants.COLOR_RED
    }
}


const SOCIAL_ICONS = [constants.ICON_FACEBOOK, constants.ICON_TWITTER, constants.ICON_SLACK,
    constants.ICON_BITCOINTALK, constants.ICON_REDDIT, constants.ICON_MEDIUM]

const GAME_SOCCER = 'soccer', GAME_MLB = 'mlb', GAME_NFL = 'nfl'

const IMG_URL_CL = 'http://img.uefa.com/imgml/2016/ucl/social/og-default.jpg',
    IMG_URL_EL = 'http://img.uefa.com/imgml/2016/uel/social/og-default.jpg',
    IMG_URL_MLB = 'http://wallpapercave.com/wp/83KPCfi.jpg'

class Home extends Component {

    constructor(props) {
        super(props)
        new WOW.WOW().init();
        this.state = {
            selectedGame: GAME_SOCCER
        }
    }

    getBetItems = () => {
        let items = []
        if (this.state.selectedGame == GAME_SOCCER) {
            items.push(this.getBetItem('Arsenal vs Southampton', '10/5/17', '10.45 PM', IMG_URL_CL))
            items.push(this.getBetItem('Real Madrid vs Juventus', '10/5/17', '10.45 PM', IMG_URL_CL))
            items.push(this.getBetItem('Olympique Lyonnais vs Ajax', '11/5/17', '11.05 PM', IMG_URL_EL))
            items.push(this.getBetItem('Man Utd vs Celta Vigo', '11/5/17', '11.05 PM', IMG_URL_EL))
        } else if (this.state.selectedGame == GAME_MLB) {
            items.push(this.getBetItem('DET Tigers vs ARI Diamondbacks', '11/5/17', '5.40 AM', IMG_URL_MLB))
            items.push(this.getBetItem('PIT Pirates vs LA Dodgers', '11/5/17', '6.10 AM', IMG_URL_MLB))
            items.push(this.getBetItem('BOS Red Sox vs MIL Brewers', '11/5/17', '21.10 PM', IMG_URL_MLB))
            items.push(this.getBetItem('KC Royals vs TB Rays', '11/5/17', '21.10 PM', IMG_URL_MLB))
        } else if (this.state.selectedGame == GAME_NFL) {

        }
        return items
    }

    getBetItem = (title, date, time, imgUrl) => {
        return {
            title: title,
            date: date,
            time: time,
            imgUrl: imgUrl,
        }
    }

    getItemCard = (item) => {
        console.log('getItemCard: ' + JSON.stringify(item))
        return <Card style={ styles.card } zDepth={3}>
            <CardMedia style={{fontFamily: 'Lato', borderRadius: 10}}
            >
                <img src={item.imgUrl} style={{height: 250, objectFit: 'cover', backgroundColor: '#0B1123'}}/>
            </CardMedia>
            <CardText style={{fontFamily: 'Lato'}}>
                <div className="game-info">
                    <h4>{item.title}</h4>
                    <div className="row">
                        <div className="col col-6">
                            <p>{item.time}</p>
                        </div>
                        <div className="col col-6">
                            <p className="float-right">{item.date}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-6">
                        </div>
                        <div className="col col-6">
                            <button className="btn btn-sm btn-primary float-right">
                                Bet Now
                            </button>
                        </div>
                    </div>
                </div>
            </CardText>
        </Card>
    }

    getSocialIcon = (type) => {
        return <div className="col col-2 text-center">
            <div className="hvr-grow-shadow">
                { this.getSocialSvg(type)}
            </div>
        </div>
    }

    getSocialSvg = (type) => {
        switch (type) {
            case constants.ICON_BITCOINTALK:
                return <BitcoinTalk color={ constants.COLOR_RED } style={ styles.social.icons } zDepth={3}/>
            case constants.ICON_FACEBOOK:
                return <Facebook color={ constants.COLOR_RED } style={ styles.social.icons }/>
            case constants.ICON_MEDIUM:
                return <Medium color={ constants.COLOR_RED } style={ styles.social.icons }/>
            case constants.ICON_REDDIT:
                return <Reddit color={ constants.COLOR_RED } style={ styles.social.icons }/>
            case constants.ICON_SLACK:
                return <Slack color={ constants.COLOR_RED } style={ styles.social.icons }/>
            case constants.ICON_TWITTER:
                return <Twitter color={ constants.COLOR_RED } style={ styles.social.icons }/>
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="home">
                    <Navbar
                        active={ constants.LINK_HOME }
                    />
                    <div className="cover wow fadeIn">
                        <div className="container">
                            <div className="row wow fadeIn parent">
                                <div className="col col-6">
                                    <img src="assets/img/connected-world.png" className="world"/>
                                </div>
                                <div className="col col-6 overlay"
                                     style={{marginTop: '12vh', paddingTop: 60, paddingBottom: 40}}>
                                    <h1 style={{marginTop: 0}}>Be the house.</h1>
                                    <h3>From anywhere in the world.<br/><span
                                        className="logo-text">decent.bet</span> -
                                        a
                                        decentralized
                                        betting platform built on the Ethereum Blockchain</h3>
                                    <button className="btn btn-outline-primary mt-3">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="upcoming" style={{paddingTop: 20}}>
                        <div className="container wow fadeIn">
                            <div className="row">
                                <div className="col col-4">
                                    <p className="header">Upcoming Games</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-0 offset-md-4 col-12 col-md-4 mt-sm-3">
                                    <div className="row">
                                        <div className="col">
                                            <p className={ "game hvr-float " +
                                            (self.state.selectedGame == GAME_SOCCER ? 'selected' : '')}
                                               onClick={() => {
                                                   self.setState({
                                                       selectedGame: GAME_SOCCER
                                                   })
                                               }}>
                                                Soccer
                                            </p>
                                        </div>
                                        <div className="col">
                                            <p className={ "game hvr-float " +
                                            (self.state.selectedGame == GAME_MLB ? 'selected' : '')}
                                               onClick={() => {
                                                   self.setState({
                                                       selectedGame: GAME_MLB
                                                   })
                                               }}>
                                                MLB
                                            </p>
                                        </div>
                                        <div className="col">
                                            <p className={ "game hvr-float " +
                                            (self.state.selectedGame == GAME_NFL ? 'selected' : '')}
                                               onClick={() => {
                                                   self.setState({
                                                       selectedGame: GAME_NFL
                                                   })
                                               }}>
                                                NFL
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop: 10, paddingTop: 60, paddingBottom: 60, backgroundColor: '#0B1123'}}>
                            <div className="container wow fadeIn">
                                <div className="row">
                                    {   self.getBetItems().map((item) =>
                                        <div className="col-12 col-md-3 hvr-float-shadow"
                                             key={ self.state.selectedGame + '_' + item.title}>
                                            { self.getItemCard(item) }
                                        </div>
                                    )}
                                </div>
                                <div className="row" style={{marginTop: 50}}>
                                    <div className="col offset-5">
                                        <button className="btn btn-primary hvr-grow">
                                            More Games
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="how">
                        <div className="container wow fadeIn">
                            <div className="row">
                                <div className="col">
                                    <div className="strike">
                                        <span>
                                            <h2 className="text-center header">How does it work?</h2>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{marginTop: 90}}>
                                <div className="col-12 col-md-4 text-center item floating">
                                    <img src="assets/img/icons/coin.png" className="icon"/>
                                    <h4>Get DBETs</h4>
                                    <p>Participate in the ICO or purchase DBETs - our official ERC-20 token - on any
                                        of our partner exchanges.</p>
                                </div>
                                <div className="col-12 col-md-4 text-center item floating">
                                    <img src="assets/img/icons/share.png" className="icon"/>
                                    <h4>Purchase House Shares</h4>
                                    <p>Buy shares into the house for DBETs. Your DBETs get deposited into the house and
                                        in return
                                        you return shares for the amount of DBETs that were deposited.</p>
                                </div>
                                <div className="col-12 col-md-4 text-center item floating">
                                    <img src="assets/img/icons/safe.png" className="icon"/>
                                    <h4>Lock up DBETs for a Quarter</h4>
                                    <p>Your DBETs are now locked up for a quarter and used as funds to hedge against
                                        bets placed by users. Shares can be placed anytime for sale in our share
                                        exchange and could be traded for DBETs.</p>
                                </div>
                                <div className="col-12 col-md-4 text-center item floating">
                                    <img src="assets/img/icons/bet.png" className="icon"/>
                                    <h4>Place Bets</h4>
                                    <p>Put some of your DBETs to use by betting on sports and any of the games that
                                        we have listed within <span className="logo-text">decent.bet</span>. All profits
                                        generated by the house from bets are to be distributed to shareholders.</p>
                                </div>
                                <div className="col-12 col-md-4 text-center item floating">
                                    <img src="assets/img/icons/earnings.png" className="icon"/>
                                    <h4>Receive Quarterly Returns</h4>
                                    <p>At the end of every quarter, profits generated would be calculated by the house
                                        and distributed to all share holders depending on the size of shares that they
                                        own. This would be trigger through a smart contract, ensuring transparency and
                                        trust.</p>
                                </div>
                                <div className="col-12 col-md-4 text-center item floating">
                                    <img src="assets/img/icons/lottery.png" className="icon"/>
                                    <h4>Have a chance at the lottery</h4>
                                    <p>20% of all profits generated by the house will automatically be used to fund a
                                        lottery,
                                        which will select a shareholder at random and award them their winnings.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="why">
                        <div className="container wow fadeIn">
                            <div className="row">
                                <div className="col">
                                    <div className="strike">
                                        <span>
                                            <h2 className="text-center header">Why decent.bet?</h2>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="reasons">
                                <div className="row">
                                    <div className="col-12 col-md-6 item text-center">
                                        <h3 className="header">Transparent</h3>
                                        <img src="assets/img/icons/transparency.png"/>
                                        <p>Being hosted on smart contracts on the Ethereum
                                            Blockchain, users can
                                            look through
                                            our contract source code as well as track any transaction made on the
                                            contract to ensure
                                            <span className="logo-text"> decent.bet</span> stays fair and relies on
                                            trustworthy game outcomes and does not cheat it's users. </p>
                                    </div>
                                    <div className="col-12 col-md-6 item text-center">
                                        <h3 className="header">Be the house</h3>
                                        <img src="assets/img/icons/house.png"/>
                                        <p>Bets placed by users will always have the house to hedge against their bets -
                                            users can buy into the house funds and receive a split of the profits at the
                                            end
                                            of every quarter. Moreover, shares into the house can be traded at any time
                                            with other users
                                            for any convenient price for liquidity.</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-6 item text-center">
                                        <h3 className="header">decent.c</h3>
                                        <img src="assets/img/icons/decentc.png"/>
                                        <p><span className="logo-text">decent.bet</span> allots 20% of all collected
                                            profits and donates them to needy causes and charities around the world.
                                            All
                                            charitable donations will be transparent and registered on the
                                            blockchain to ensure honesty and trustworthiness.
                                        </p>
                                    </div>
                                    <div className="col-12 col-md-6 item text-center">
                                        <h3 className="header">White Label</h3>
                                        <img src="assets/img/icons/whitelabel.png"/>
                                        <p>After Year 2, <span className="logo-text">decent.bet</span> will open it's
                                            API and
                                            custom houses on the platform for betting companies to join in the platform
                                            with custom lines and APIs. This would ultimately benefit users of the platform, by
                                            simply holding shares in the platform as share prices would shoot up with
                                            a larger user base joining in the long run.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ico">
                    </div>
                    <div className="roadmap">
                    </div>
                    <div className="social-channels">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center">Join us on any of our social media channels</h3>
                                </div>
                            </div>
                            <div className="row" style={{marginTop: 75}}>
                                {   SOCIAL_ICONS.map((type) =>
                                    self.getSocialIcon(type)
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="subscribe">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="strike">
                                        <span>
                                    <h1 className="text-center header">Subscribe to our newsletter</h1>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <TextField
                                        style={ styles.textField }
                                        inputStyle={{color: constants.COLOR_WHITE}}
                                        type="email"
                                        floatingLabelText="E-mail address"
                                        floatingLabelStyle={styles.floatingLabelStyle}
                                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                        underlineFocusStyle={styles.underlineStyle}
                                    />
                                    <button className="btn btn-primary">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Home