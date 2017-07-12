/**
 * Created by user on 4/28/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

const WOW = require('wowjs');
const ethUnits = require('ethereum-units')
const countdown = require('countdown')
const request = require('request')

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Footer from '../../Base/Footer/v1/Footer'
import Themes from '../../Base/Themes'
import Loading from '../../Base/Loading'

import Helper from '../../Helper'

const helper = new Helper()
const themes = new Themes()
const constants = require('./../../Constants')

import ContractHelper from '../../ContractHelper'

const contractHelper = new ContractHelper()

import Navbar from '../../Base/Navbar/v1/Navbar'
import Login from './Login'

import './crowdsale.css'

const styles = {
    card: {
        borderRadius: 10,
        padding: 30,
        fontFamily: 'Lato'
    },
    underlineStyle: {
        borderColor: constants.COLOR_RED,
    },
    floatingLabelStyle: {
        color: constants.COLOR_RED
    },
    checkbox: {
        marginBottom: 16,
    }
}

const BLOCKTIME = 15000

class Crowdsale extends Component {

    constructor(props) {
        super(props)
        new WOW.WOW().init();
        this.state = {
            accounts: [],
            selectedAccount: null,
            selectedBalance: 0,
            buyAmount: '',
            usdValue: '',
            refundAmount: '',
            ethRate: 0,
            ico: {
                balance: 0,
                tokensRaised: 0,
                blockAtPageInit: 0,
                timeAtPageInit: 0,
                endBlock: 0,
                timeRemaining: 0
            },
            loading: {
                state: false,
                message: 'Loading..'
            }
        }
    }

    componentWillMount() {
        this.initCountdown()
        this.initContract()
        this.getETHUSDPrice()
        this.setMetaMaskAccountChangeListener()
    }

    setMetaMaskAccountChangeListener = () => {
        const self = this
        let account = helper.getWeb3().eth.accounts[0]
        self.setState({
            selectedAccount: account
        })
        setInterval(function () {
            if (helper.getWeb3().eth.accounts[0] !== account) {
                console.log('MetaMask account ' + helper.getWeb3().eth.accounts[0] +
                    ' changed to default account from ' + account)
                account = helper.getWeb3().eth.accounts[0]
                self.setState({
                    selectedAccount: account
                })
            }
        }, 500);
    }

    initCountdown = () => {
        countdown.setLabels(
            '| s| m| h| d| w| mo| yr|||',
            '| s| m| h| d| w| mo| yr|||',
            ' and ',
            ', ',
            '',
            function (n) {
                return n.toString();
            });
    }

    initContract = () => {
        const self = this
        contractHelper.getTokenContract((instance) => {
            helper.getWeb3().eth.getAccounts((err, accounts) => {
                console.log('Accounts: ' + JSON.stringify(accounts))
                console.log('default account: ' + accounts[0])
                self.setState({
                    selectedAccount: accounts[0],
                    accounts: accounts
                })
                self.getETHBalance(accounts[0])
            })
            self.setState({
                tokenContract: instance
            })
            self.initTokenDiv(instance)
        })
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

    initTokenDiv = (instance) => {
        console.log('initTokenDiv')
        const self = this
        let accounts = helper.getWeb3().eth.accounts
        instance.balanceOf(accounts[0]).then(function (balance) {
            balance = parseFloat(balance)
            console.log('Balance of ' + accounts[0] + ' = ' + self.formatBalance(balance) + ' DBETs. ')
            self.setState({
                selectedAccount: accounts[0],
                selectedBalance: self.formatBalance(balance)
            })
        })
        helper.getWeb3().eth.getBlockNumber((err, blockNumber) => {
            console.log('Current block: ' + blockNumber)
            instance.fundingEndBlock().then((endBlock) => {
                console.log('Funding ends at block: ' + endBlock)
                let ico = self.state.ico
                ico.blockAtPageInit = blockNumber
                ico.timeAtPageInit = helper.getTimestampMillis()
                ico.endBlock = endBlock
                console.log('ICO: ' + JSON.stringify(ico))
                self.setState({
                    ico: ico
                })
                self.beginCountdown(ico)
            })
        })
        self.getETHBalance(instance.address, true)
    }

    beginCountdown = (ico) => {
        const self = this
        this.updateTimeRemainingForEnd(ico)
        setInterval(() => {
            this.updateTimeRemainingForEnd(self.state.ico)
        }, 1000)
    }

    getCurrentBlock = () => {
        if (this.state.ico.blockAtPageInit > 0) {
            const timeDifference = helper.getTimestampMillis() - this.state.ico.timeAtPageInit
            const blocksElapsed = timeDifference / BLOCKTIME
            // console.log('Current block: ' + (this.state.ico.blockAtPageInit + blocksElapsed)
            //     + '/' + contractHelper.getWeb3().eth.blockNumber)
            return this.state.ico.blockAtPageInit + blocksElapsed
        } else
            return 0
    }

    updateTimeRemainingForEnd = (ico) => {
        if (ico.blockAtPageInit > 0) {
            const currentBlock = this.getCurrentBlock()
            const blocksRemaining = ico.endBlock - currentBlock
            let timeRemaining = countdown(new Date(ico.timeAtPageInit),
                new Date((ico.timeAtPageInit + (blocksRemaining * BLOCKTIME))),
                countdown.DAYS & countdown.HOURS & countdown.MINUTES & countdown.SECONDS)
            ico.timeRemaining = timeRemaining.toString()
            this.setState({
                ico: ico
            })
        }
    }

    getAccountMenuItems = () => {
        let menuItems = []
        this.state.accounts.forEach((account) => {
            menuItems.push(<MenuItem value={account} primaryText={'' + account}/>)
        })
        return menuItems
    }

    getETHBalance = (account, isICO) => {
        const self = this
        helper.getWeb3().eth.getBalance(account, (err, result) => {
            let ethBalance = parseFloat(ethUnits.convert(parseFloat(result), 'wei', 'ether').toString())
            console.log('Balance: ' + account + ', ' + ethBalance + ' ETH')
            if (isICO) {
                let ico = self.state.ico
                ico.balance = ethBalance
                self.setState({
                    ico: ico
                })
            }
        })
    }

    getTokenBalance = (account) => {
        const self = this
        if (this.state.tokenContract) {
            this.state.tokenContract.balanceOf(account).then(function (balance) {
                balance = parseFloat(balance)
                console.log('Balance of ' + account + ' = ' + self.formatBalance(balance) + ' DBETs. ')
                self.setState({
                    selectedBalance: self.formatBalance(balance)
                })
            })
        }
    }

    formatBalance = (balance) => {
        return parseFloat(balance / 1000)
    }

    getAccountSelector = () => {
        const self = this
        return <SelectField
            floatingLabelText="Select account"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={self.state.selectedAccount}
            labelStyle={{color: constants.COLOR_WHITE}}
            onChange={(event, index, value) => {
                self.getTokenBalance(value)
                self.getETHBalance(value)
                self.setState({
                    selectedAccount: value
                })
            }}
        >
            { self.getAccountMenuItems() }
        </SelectField>
    }

    buyDBets = () => {
        const self = this
        let tokens = parseInt(this.state.buyAmount)
        console.log('buyDBets - ' + tokens + ' - ' + this.state.buyAmount)
        if (tokens > 0) {
            let value = (tokens / 1000) * ethUnits.units.ether
            console.log('Buying ' + tokens + ' tokens for ' + value + ' wei')
            self.toggleLoading(true, 'Buying DBETs')
            helper.getWeb3().eth.sendTransaction({
                from: this.state.selectedAccount,
                to: this.state.tokenContract.address,
                value: value,
                gas: 200000
            }, (err, result) => {
                if (!err) {
                    console.log('Purchased ' + tokens + ' DBETs for ' + value + ' wei. Txid: ' + JSON.stringify(result))
                    self.toggleLoading(false, 'Loading..')
                    self.getTokenBalance(self.state.selectedAccount)
                    self.getETHBalance(self.state.selectedAccount)
                    self.getETHBalance(self.state.tokenContract.address, true)
                } else {
                    self.toggleLoading(false)
                }
                // contractHelper.getWeb3().eth.getTransaction(txid, (err, result) => {
                //     console.log('Transaction ID: ' + txid + ', ' + JSON.stringify(result))
                // })
            })
            // this.state.tokenContract.sendTransaction({
            //     from: this.state.selectedAccount,
            //     to: this.state.tokenContract.address,
            //     value: value,
            //     gas: 200000
            // }).then((result) => {
            // })
        }
    }

    refundDBets = () => {
        const self = this
        if (this.state.selectedBalance > 0) {
            console.log('Refunding ' + this.state.selectedBalance + ' DBETs')
            this.state.tokenContract.refund.sendTransaction({
                from: this.state.selectedAccount,
                to: this.state.tokenContract.address,
                gas: 200000
            }).then((result) => {
                console.log('Refunded Tokens')
                self.getTokenBalance(self.state.selectedAccount)
                self.getETHBalance(self.state.selectedAccount)
            })
        }
    }

    getTokenContractAddress = () => {
        return this.state.tokenContract ? this.state.tokenContract.address : 'Loading..'
    }

    toggleLoading = (state, message) => {
        let loading = this.state.loading
        loading.state = state
        loading.message = !message ? 'Loading..' : message
        this.setState({
            loading: loading
        })
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="crowdsale">
                    <Navbar
                        active={ constants.LINK_ICO }
                    />
                    <div className="cover">
                        <h1 className="text-center">Crowdsale</h1>
                        <hr className="divider"/>
                        <div className="mt-5">
                            {   !helper.isLoggedIn() &&
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <Login onLogin={() => {
                                            self.forceUpdate()
                                        }}/>
                                    </div>
                                </div>
                            </div>
                            }
                            {   helper.isLoggedIn() &&
                            <div>
                                {   self.state.loading.state &&
                                <Loading message={ self.state.loading.message }/>
                                }
                                {   !self.state.loading.state &&
                                <div className="crowdsale-div">
                                    <div className="container">
                                        <div className="row mt-4">
                                            <div className="col">
                                                <Card zDepth={2} style={ styles.card }>
                                                    <div>
                                                        <h3 className="text-center">Participate</h3>
                                                        <p className="mt-4 mb-1">Please send Ether to only the contract
                                                            address mentioned below using your preferred Ethereum Wallet
                                                            or
                                                            Browser.
                                                            If you're using MetaMask, simply fill out the form below and
                                                            hit
                                                            the send button. Review the transaction details and click on
                                                            Accept to send your Ether and receive your DBETS.</p>
                                                        <h4 className="text-center"
                                                            style={{marginTop: 40}}>{ self.getTokenContractAddress() }</h4>
                                                        <div className="row">
                                                            <div className="col-5">
                                                                <TextField
                                                                    style={{width: '100%'}}
                                                                    floatingLabelText="DBETs"
                                                                    floatingLabelStyle={ styles.floatingLabelStyle }
                                                                    underlineStyle={ styles.underlineStyle }
                                                                    underlineFocusStyle={ styles.underlineStyle }
                                                                    value={ self.state.buyAmount }
                                                                    type="number"
                                                                    onChange={(event, value) => {
                                                                        if (value.length > 0) {
                                                                            let usdValue = value * (self.state.ethRate / 1000)
                                                                            self.setState({
                                                                                buyAmount: value,
                                                                                usdValue: usdValue
                                                                            })
                                                                        } else
                                                                            self.setState({
                                                                                buyAmount: '',
                                                                                usdValue: ''
                                                                            })
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-5">
                                                                <TextField
                                                                    style={{width: '100%'}}
                                                                    floatingLabelText="USD"
                                                                    floatingLabelStyle={ styles.floatingLabelStyle }
                                                                    underlineStyle={ styles.underlineStyle }
                                                                    underlineFocusStyle={ styles.underlineStyle }
                                                                    value={ self.state.usdValue }
                                                                    type="number"
                                                                    onChange={(event, value) => {
                                                                        if (value.length > 0) {
                                                                            let buyAmount = value / (self.state.ethRate / 1000)
                                                                            self.setState({
                                                                                usdValue: value,
                                                                                buyAmount: buyAmount
                                                                            })
                                                                        } else
                                                                            self.setState({
                                                                                buyAmount: '',
                                                                                usdValue: ''
                                                                            })
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-2" style={{paddingTop: 25}}>
                                                                <RaisedButton
                                                                    backgroundColor={ constants.COLOR_RED }
                                                                    labelColor={ constants.COLOR_WHITE }
                                                                    onClick={ self.buyDBets }
                                                                    label="Buy"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="col">
                                                                <p className="text-center"
                                                                   style={{fontSize: 14}}>Current ETH
                                                                    price: {self.state.ethRate} USD/ETH
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="col">
                                                                <small className="font-weight-bold">Make sure that the
                                                                    sending
                                                                    address is capable of
                                                                    interacting
                                                                    with
                                                                    ERC20
                                                                    tokens, and is NOT from an exchange such as
                                                                    Poloniex,
                                                                    Kraken,
                                                                    Coinbase, 云币，元宝, etc… or you will be unable to
                                                                    interact with tokens sent from this address.
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-6">
                                                <Card zDepth={2} style={{borderRadius: 10}}>
                                                    <div className="card-div" style={{height: 225}}>
                                                        <h3>Crowdsale Statistics</h3>
                                                        <div className="row mt-4 highlight">
                                                            <div className="col-6">
                                                                <p>ETH</p>
                                                            </div>
                                                            <div className="col-6 text-right">
                                                                <p>{ self.state.ico.balance }</p>
                                                            </div>
                                                        </div>
                                                        <div className="row highlight">
                                                            <div className="col-6">
                                                                <p>USD</p>
                                                            </div>
                                                            <div className="col-6 text-right">
                                                                <p>{ (self.state.ethRate == 0) ?
                                                                    'Loading' : (self.state.ethRate * self.state.ico.balance)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="row highlight">
                                                            <div className="col-6">
                                                                <p className="mb-1">Time Remaining</p>
                                                            </div>
                                                            <div className="col-6 text-right">
                                                                <p className="mb-1 font-weight-bold">{ self.state.ico.timeRemaining != 0 ?
                                                                    self.state.ico.timeRemaining : 'Loading..' }</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                            <div className="col-6">
                                                <Card zDepth={2} style={{borderRadius: 10}}>
                                                    <div className="card-div" style={{height: 225}}>
                                                        <h3>Your Balance</h3>
                                                        <h1 className="text-center color-green mb-2">{ self.state.selectedBalance }</h1>
                                                        <h4 className="text-center mt-1">DBETs</h4>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="instructions" style={{marginTop: 125}}>
                                        <div className="container">
                                            <div className="row" style={{marginTop: 25}}>
                                                <div className="col">
                                                    <h1 className="text-center">Instructions</h1>
                                                    <hr className="divider"/>
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col col-6 choice">
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
                                                <div className="col col-6">
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
                                                <div className="col col-6">
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
                                                <div className="col col-6">
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
                                </div>
                                }
                            </div>
                            }
                        </div>
                    </div>
                    <hr/>
                    <Footer hideDivider={true}/>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Crowdsale