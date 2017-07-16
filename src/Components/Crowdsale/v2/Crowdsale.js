/**
 * Created by user on 7/12/2017.
 */

import React, {Component} from 'react'

import Themes from '../../Base/Themes'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import LinearProgress from 'material-ui/LinearProgress'

import Navbar from './../../Base/Navbar/v2/Navbar'
import Footer from './../../Base/Footer/v2/Footer'

const countdown = require('countdown')
const ethUnits = require('ethereum-units')
const request = require('request')

const themes = new Themes()

const constants = require('./../../Constants')

import './crowdsale.css'


class Crowdsale extends Component {

    constructor(props) {
        super(props)
        this.state = {
            address: 'TO BE ANNOUNCED',
            ethRate: 0,
            amounts: {
                dbets: 1000,
                eth: 1
            },
            ico: {
                balance: 0,
                tokensRaised: 0,
                maxTokenCap: 350000000,
                dbetsPerEth: 1000,
                timeRemaining: 0
            }
        }
    }

    componentWillMount() {
        this.getETHUSDPrice()
    }

    getETHUSDPrice = () => {
        const self = this
        const URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
        let options = {
            url: URL,
            qs: {
                fsym: 'ETH',
                tsyms: 'USD'
            }
        };
        request(options, function (err, response, body) {
            console.log('getETHUSDPrice: ' + JSON.parse(body).USD)
            self.setState({
                ethRate: JSON.parse(body).USD
            })
        });
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getProgressBar()}>
                <div className="crowdsale">
                    <Navbar active={constants.LINK_ICO}/>
                    <div className="cover">
                        <img src={process.env.PUBLIC_URL + '/assets/img/backgrounds/crowdsale-cover.PNG'}
                             className="animated fadeIn"/>
                    </div>
                    <div className="details">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h4 className="text-center">PARTICIPATE</h4>
                                    <hr/>
                                    <p className="info">Please send Ether to only the contract address mentioned below
                                        using your preferred
                                        Ethereum Wallet or Browser. If you're using MetaMask, simply fill out the form
                                        below
                                        and hit the send button. Review the transaction details and click on Accept to
                                        send
                                        your Ether and receive your DBETS.</p>
                                    <h3>TOKEN DISTRIBUTION</h3>
                                    <p className="remaining">REMAINING <span className="time">?? : ?? : ??</span></p>
                                    <LinearProgress
                                        mode="determinate"
                                        value={self.state.ico.tokensRaised / self.state.ico.maxTokenCap}
                                        className="progressbar"
                                    />
                                    <div className="dbet-meter">
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="start">0</p>
                                            </div>
                                            <div className="col-6 pr-0">
                                                <p className="end">350M DBETs</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="prices">
                                        <div className="row">
                                            <div className="col-12 col-md-6">
                                                <p className="text-md-left text-center">USD <span
                                                    className="price">{ self.state.ico.balance }</span>
                                                </p>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <p className="text-md-right text-center">ETH
                                                    <span className="price">
                                                    { ' ' + (self.state.ethRate != 0 ?
                                                        (self.state.ico.balance / self.state.ethRate) : 0)
                                                    }
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="buy">
                        <div className="container">
                            <div className="row">
                                <div className="col hidden-md-down">
                                    <p className="address text-center">ADDRESS&#09;<span
                                        className="ico-address">{ self.state.address }</span></p>
                                </div>
                                <div className="col hidden-md-up">
                                    <p className="address text-center">ADDRESS&#09;</p>
                                    <p className="ico-address text-center">{ self.state.address }</p>
                                </div>
                            </div>
                            <div className="row conversion">
                                <div className="col-12 col-md-5 offset-md-1 mt-4 mt-md-0">
                                    <div className="dbets">
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="text-center">DBETS</p>
                                            </div>
                                            <div className="col-6">
                                                <input value={self.state.amounts.dbets}
                                                       type="number"
                                                       onChange={(e) => {
                                                           let value = e.target.value
                                                           let amounts = self.state.amounts
                                                           if (value.length > 0) {
                                                               let ethValue = value / (self.state.ico.dbetsPerEth)
                                                               amounts.dbets = value
                                                               amounts.eth = ethValue
                                                           } else {
                                                               amounts.dbets = ''
                                                               amounts.eth = ''
                                                           }
                                                           self.setState({
                                                               amounts: amounts
                                                           })
                                                       }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-5 mt-4 mt-md-0">
                                    <div className="eth">
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="text-center">ETH</p>
                                            </div>
                                            <div className="col-6">
                                                <input value={self.state.amounts.eth} type="number"
                                                       onChange={(e) => {
                                                           let value = e.target.value
                                                           let amounts = self.state.amounts
                                                           if (value.length > 0) {
                                                               let dbetsValue = value * (self.state.ico.dbetsPerEth)
                                                               amounts.dbets = dbetsValue
                                                               amounts.eth = value
                                                           } else {
                                                               amounts.dbets = ''
                                                               amounts.eth = ''
                                                           }
                                                           self.setState({
                                                               amounts: amounts
                                                           })
                                                       }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <p className="text-center price">CURRENT ETHER PRICE = {self.state.ethRate}
                                        USD/ETH</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="buy-dbets btn">BUY</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p className="warning">Make sure that the
                                        sending
                                        address is capable of
                                        interacting
                                        with
                                        ERC20
                                        tokens, and is NOT from an exchange such as
                                        Poloniex,
                                        Kraken,
                                        Coinbase etc… or you will be unable to
                                        interact with tokens sent from this address.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="instructions">
                        <div className="container">
                            <div className="row" style={{marginTop: 25}}>
                                <div className="col">
                                    <h1 className="text-center">INSTRUCTIONS</h1>
                                    <hr className="divider"/>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-12 col-md-6 choice">
                                    <div className="row">
                                        <img className="logo hvr-grow clickable"
                                             src="assets/img/logos/metamask.png"/>
                                    </div>
                                    <h4 className="text-center mt-3">MetaMask</h4>
                                    <ul className="mt-4">
                                        <li>Download the <a href="#">MetaMask</a> Chrome extension. If
                                            you
                                            don't have Google Chrome, download it <a href="#">here</a>
                                        </li>
                                        <li>Accept the terms and conditions in MetaMask and Create a new
                                            vault.
                                            Enter a strong password and continue.
                                        </li>
                                        <li>Copy the seed phrase and store it securely somewhere.
                                            Without
                                            the seed phrase
                                            you will <span className="font-weight-bold">NOT</span> be
                                            able
                                            to recover your wallets later.
                                        </li>
                                        <li>Once you're done, click on the button on the top-left and
                                            select the Main Ethereum Network.
                                        </li>
                                        <li>
                                            The MetaMask window will now close and reload. Click on it
                                            and
                                            enter your password again.
                                        </li>
                                        <li>
                                            If you don't have any Ether in your new wallet, send it from
                                            an
                                            exchange or buy it directly from MetaMask by clicking on the
                                            Buy
                                            button and following the instructions there.
                                        </li>
                                        <li>
                                            Once you're done, simply enter the amount of DBETs you'd
                                            like to
                                            buy and click on the Buy button.
                                            MetaMask will show you a confirmation window. Make sure you
                                            set
                                            the gas at <span className="font-weight-bold">200,000</span>
                                            wei
                                            and click Accept.
                                        </li>
                                        <li>
                                            Wait for the loading screen to complete and you're done! You
                                            should have your DBETs credited to your account.
                                            Note that you will not be able to transfer your DBETs till
                                            the
                                            ICO is over.
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <img className="logo scaling clickable"
                                             src="assets/img/logos/ethereum.png"/>
                                    </div>
                                    <h4 className="text-center mt-3">Mist</h4>
                                    <ul className="mt-4">
                                        <li>
                                            Download the Mist Browser <a href="#">here</a>
                                        </li>
                                        <li>Create a new account and enter a strong password. Backup
                                            your
                                            new accounts keystores
                                            once you're done in a safe and secure storage device.
                                        </li>
                                        <li>Select your account and fund it with Ether. Either straight
                                            from
                                            the Mist browser if any of the options available is viable.
                                            Otherwise, simply transfer from an exchange to your wallet
                                            address.
                                        </li>
                                        <li>Once you have Ether in your account, click on the contracts
                                            button on the top right of the browser. Now click on "Watch
                                            Contract".
                                        </li>
                                        <li>
                                            Copy the <a href="#">ICO contract details</a> from here and
                                            click on OK.
                                        </li>
                                        <li>
                                            Now Click on the <span className="font-weight-bold">DecentBetToken</span>
                                            contract and enter the amount of Ether you'd like to send to
                                            the
                                            contract.
                                            If you'd like to know how many DBETs you'd receive in
                                            return,
                                            use the converter in this page.
                                        </li>
                                        <li>
                                            Once you've decided on an amount, click on the send button
                                            and
                                            accept the transaction confirmation window to
                                            send Ether to the contract and receive DBETs in return.
                                        </li>
                                        <li>
                                            Note that you will not be able to transfer your DBETs till
                                            the
                                            ICO is over.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <img className="logo hvr-grow clickable"
                                             src="assets/img/logos/parity.png"/>
                                    </div>
                                    <h4 className="text-center mt-1">Parity</h4>
                                    <ul className="mt-4">
                                        <li>Download Parity <a
                                            href="https://ethcore.io/parity.html">here</a> and generate
                                            a
                                            new wallet address by clicking 'NEW ACCOUNT' and then
                                            following
                                            the prompts
                                        </li>
                                        <li>Select your account and fund it with Ether.
                                            The simplest way being simply transferring from an exchange
                                            to
                                            your wallet
                                            address.
                                        </li>
                                        <li>
                                            Click "TRANSFER". For "type of token transfer" select
                                            "Ethereum".
                                            For "recipient address" enter the <a href="#">ICO contract
                                            address</a> listed
                                            above.
                                        </li>
                                        <li>
                                            Now Click on the <span className="font-weight-bold">DecentBetToken </span>
                                            contract and enter the amount of Ether you'd like to send to
                                            the
                                            contract.
                                            If you'd like to know how many DBETs you'd receive in
                                            return,
                                            use the converter in this page.
                                        </li>
                                        <li>
                                            Congratulations, you have just purchased your DBETS. After
                                            transaction confirmation, your DBET token balance will show
                                            up
                                            in the address you sent from, but to see your token balance,
                                            you
                                            will need to first 'watch' the DBET token.
                                        </li>
                                        <li>
                                            Note that you will not be able to transfer your DBETs till
                                            the
                                            ICO is over.
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <img className="logo hvr-grow clickable"
                                             src="assets/img/logos/myetherwallet.png"/>
                                    </div>
                                    <h4 className="text-center mt-1">MyEtherWallet</h4>
                                    <ul className="mt-4">
                                        <li>
                                            If you have used mist before, find
                                            your keystore and you can skip to the next step. If you need
                                            to
                                            create
                                            a new wallet, simply visit
                                            MyEtherWallet, enter a strong password and generate a
                                            wallet.
                                        </li>
                                        <li>
                                            Store your Private Key. You can
                                            download .JSON file with an encrypted version of the private
                                            key
                                            which is compatible with geth, mist and myetherwallet and
                                            requires a password to decrypt (Keystore).
                                        </li>
                                        <li>Once you have your wallet you can now send and receive
                                            transactions. All you have to do is upload the private key
                                            file
                                            you have created through the MyEtherWallet website or
                                            mist/geth.
                                            Simply click "Send Transaction", select the type of private
                                            key
                                            you want to use (Keystore, Json file or Plain text) and
                                            click
                                            "Select wallet file".
                                        </li>
                                        <li>
                                            Select the wallet you want to use. You can check the wallet
                                            adress the key belongs to, by looking at the file name and
                                            adding "0x" in the beginning of the address. Mist wallet
                                            private
                                            keys are usually stored in .folder. Once you've selected the
                                            correct private key, type the password and click "Unlock
                                            wallet"
                                        </li>
                                        <li> Now enter the <a href="#">ICO contract address</a> you want
                                            to
                                            send
                                            Ether to, and how much you want to send. Use the converter
                                            in
                                            this page if you'd like to know exactly how much you'd like
                                            to
                                            send. Click "Generate
                                            transaction" and then "Send transaction".
                                        </li>
                                        <li>
                                            Congratulations, you have just purchased your DBETS. After
                                            transaction confirmation, your DBET token balance will show
                                            up
                                            in the address you sent from, but to see your token balance,
                                            you
                                            will need to first 'watch' the DBET token.
                                        </li>
                                        <li>
                                            Note that you will not be able to transfer your DBETs till
                                            the
                                            ICO is over.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer active={constants.LINK_ICO}/>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Crowdsale