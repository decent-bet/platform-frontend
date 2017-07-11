/**
 * Created by user on 5/24/2017.
 */

import React, {Component} from 'react'
import $ from 'jquery'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import Themes from './../Base/Themes'
import Helper from './../Helper'
import Loading from './../Base/Loading'

import Home from './Home'

import Craps from './Casino/Craps/Craps'
import Slots from './Casino/Slots/SlotsChannel'

import About from './Help/About'
import Faq from './Help/Faq'

import ShareExchange from './House/ShareExchange'
import Statistics from './House/Statistics'

import Sportsbook from './Sportsbook/Sportsbook'

import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import './dapp.css'

const constants = require('./../Constants')

const themes = new Themes()
const helper = new Helper()

const PAGE_HOME = 0, PAGE_SPORTSBOOK = 1, PAGE_SHARE_EXCHANGE = 2, PAGE_HOUSE_STATISTICS = 3, PAGE_ABOUT = 4,
    PAGE_FAQ = 5, PAGE_CRAPS = 6, PAGE_SLOTS = 7

const SPORTSBOOK_SUB_FEATURED = 0, SPORTSBOOK_SUB_SOCCER = 1, SPORTSBOOK_SUB_NHL = 2, SPORTSBOOK_SUB_NFL = 3,
    SPORTSBOOK_SUB_MMA = 4, SPORTSBOOK_SUB_BOXING = 5

const styles = {
    floatingLabelStyle: {
        color: constants.COLOR_PRIMARY
    }
}

class Dapp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            accounts: [],
            amountRaised: 0,
            tokensSold: 0,
            ethNetwork: 0,
            selectedPage: PAGE_SLOTS,
            subPage: SPORTSBOOK_SUB_SOCCER,
            contractsLoaded: false
        }
    }

    componentWillMount() {
        this.initBalances()
        this.initContract()
        this.loadEthereumNetwork()
        window.onload = () => {
            $("#menu-toggle").click(function (e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });
        }
    }

    loadEthereumNetwork = () => {
        const self = this
        helper.getWeb3().version.getNetwork((err, netId) => {
            self.setState({
                ethNetwork: netId
            })
        })
    }

    initContract = () => {
        const self = this
        setTimeout(() => {
            self.setState({
                contractsLoaded: true
            })
            self.initTokenDiv(helper.getContractHelper().getTokenInstance())
            console.log('House: ' + helper.getContractHelper().getInstance(1).address)
        }, 1000)
    }

    getBalance = (account) => {
        helper.getWeb3().eth.getBalance(account, (err, result) => {
            console.log('Balance: ' + account + ', ' + JSON.stringify(result))
        })
    }

    initBalances = () => {
        const self = this
        helper.getWeb3().eth.getAccounts((err, accounts) => {
            console.log('Accounts: ' + JSON.stringify(accounts))
            console.log('default account: ' + accounts[0])
            self.setState({
                selectedAccount: accounts[0],
                accounts: accounts
            })
            self.getBalance(accounts[0])
        })
    }

    initTokenDiv = (instance) => {
        const self = this
        let accounts = helper.getWeb3().eth.accounts
        instance.balanceOf(accounts[0]).then(function (balance) {
            console.log('Balance of ' + accounts[0] + ' = ' + balance + ' DBETs')
            self.setState({
                selectedAccount: accounts[0],
                selectedBalance: balance
            })
        })
    }

    getAccountMenuItems = () => {
        let menuItems = []
        this.state.accounts.forEach((account) => {
            menuItems.push(<MenuItem value={account} primaryText={'' + account}/>)
        })
        return menuItems
    }

    getAccountBalance = (account) => {
        const self = this
        if (this.state.tokenContract) {
            this.state.tokenContract.balanceOf(account).then(function (balance) {
                console.log('Balance of ' + account + ' = ' + balance + ' DBETs')
                self.setState({
                    selectedBalance: balance
                })
            })
        }
    }

    getAccountSelector = () => {
        const self = this
        return <SelectField
            floatingLabelText="Select account"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={self.state.selectedAccount}
            onChange={(event, index, value) => {
                self.getAccountBalance(value)
                self.setState({
                    selectedAccount: value
                })
            }}
        >
            { self.getAccountMenuItems() }
        </SelectField>
    }

    getSidebarLink = (title, page, subPage) => {
        const self = this
        return <li>
            <a href="#"
               className={
                   self.state.selectedPage == PAGE_SPORTSBOOK ?
                       ((self.state.selectedSubPage == subPage ? 'selected' : '')) :
                       (self.state.selectedPage == page ? 'selected' : '')
               }
               onClick={() => {
                   self.setState({
                       selectedPage: page,
                       selectedSubPage: subPage
                   })
               }}>
                {title}
            </a>
        </li>
    }

    getEthereumNetwork = () => {
        switch (this.state.ethNetwork) {
            case "0":
                return "Loading.."
            case "1":
                return 'Ethereum Mainnet'
            case "2":
                return 'Morden test network'
            case "3":
                return 'Ropsten test network'
            default:
                return 'Private test network'
        }
    }

    getAddress = () => {
        return window.web3.eth.accounts[0]
    }

    getSelectedPage = () => {
        switch (this.state.selectedPage) {
            case PAGE_HOME:
                return <Home/>
            case PAGE_SHARE_EXCHANGE:
                return <ShareExchange/>
            case PAGE_HOUSE_STATISTICS:
                return <Statistics/>
            case PAGE_CRAPS:
                return <Craps/>
            case PAGE_SLOTS:
                return <Slots/>
            case PAGE_ABOUT:
                return <About/>
            case PAGE_FAQ:
                return <Faq/>
            case PAGE_SPORTSBOOK:
                return <Home/>
            default:
                return <Home/>
        }
    }

    getFormattedBalance = () => {
        if (this.state.selectedBalance)
            return helper.roundDecimals(helper.formatEther(this.state.selectedBalance), 4)
        else
            return 0
    }

    render() {
        const self = this
        return <div>
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="dapp" style={{backgroundColor: '#F7F8FB'}}>
                    <AppBar
                        zDepth={2}
                        style={{
                            backgroundColor: constants.COLOR_PRIMARY,
                            position: 'fixed',
                            top: 0
                        }}
                        showMenuIconButton={false}
                        title={<a href="/" className="text-white font-weight-bold hvr-shrink"
                                  style={{fontFamily: 'Lato', textDecoration: 'none', fontSize: 19}}>decent.bet</a>}
                        iconElementRight={
                            <div>
                                <button className="btn btn-sm btn-primary hvr-fade"
                                        style={{fontSize: 12, marginTop: 12.5, marginRight: 10, fontFamily: 'Lato'}}
                                        onClick={ () => {
                                        }}>{ 'Balance: ' + self.getFormattedBalance() + ' DBETs' }
                                </button>
                            </div>
                        }
                    />
                    <div id="wrapper" className="toggled"
                         style={{minHeight: '100vh', paddingTop: 65}}>
                        <div className="row">
                            <div className="col-9">
                                <div id="sidebar-wrapper" className="scrollbar">
                                    <ul className="sidebar-nav">
                                        <p className="header">
                                            S P O R T S B O O K
                                        </p>
                                        <li>
                                            { self.getSidebarLink('Featured', PAGE_SPORTSBOOK, SPORTSBOOK_SUB_FEATURED)}
                                            { self.getSidebarLink('Soccer', PAGE_SPORTSBOOK, SPORTSBOOK_SUB_SOCCER)}
                                            { self.getSidebarLink('NHL', PAGE_SPORTSBOOK, SPORTSBOOK_SUB_NHL)}
                                            { self.getSidebarLink('NFL', PAGE_SPORTSBOOK, SPORTSBOOK_SUB_NFL)}
                                            { self.getSidebarLink('MMA', PAGE_SPORTSBOOK, SPORTSBOOK_SUB_MMA)}
                                            { self.getSidebarLink('Boxing', PAGE_SPORTSBOOK, SPORTSBOOK_SUB_BOXING)}
                                        </li>
                                        <hr className="mt-4"/>
                                        <p className="header">
                                            C A S I N O
                                        </p>
                                        <li>
                                            { self.getSidebarLink('Slots', PAGE_SLOTS)}
                                            { self.getSidebarLink('Craps', PAGE_CRAPS)}
                                        </li>
                                        <hr className="mt-4"/>
                                        <p className="header">
                                            H O U S E
                                        </p>
                                        <li>
                                            { self.getSidebarLink('Statistics', PAGE_HOUSE_STATISTICS)}
                                            { self.getSidebarLink('Share Exchange', PAGE_SHARE_EXCHANGE)}
                                        </li>
                                        <hr className="mt-4"/>
                                        <p className="header">
                                            H E L P
                                        </p>
                                        <li>
                                            { self.getSidebarLink('About', PAGE_ABOUT)}
                                            { self.getSidebarLink('FAQ', PAGE_FAQ)}
                                        </li>
                                        <hr className="mt-4"/>
                                    </ul>
                                </div>

                                <div id="page-content-wrapper">
                                    {   self.state.contractsLoaded &&
                                    <div>
                                        { self.getSelectedPage() }
                                    </div>
                                    }
                                    {   !self.state.contractsLoaded &&
                                    <div>
                                        <div className="text-center text-gray-dark" style={{
                                            marginTop: 200,
                                            paddingLeft: 50
                                        }}>
                                            <Loading message="Loading contracts.."
                                                     color={ constants.COLOR_PRIMARY_DARK }/>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>
                            <div className="col-3 details" style={{
                                marginTop: 40,
                                paddingTop: 40,
                                paddingRight: 50
                            }}>
                                <div className="row mb-4">
                                    <img className="logo floating" src="assets/img/logos/ethereum.png"/>
                                </div>
                                <p className="text-center mt-3 mb-2">You are currently connected to</p>
                                <p className="text-center mt-3 clickable"
                                   style={{color: constants.COLOR_PRIMARY_DARK}}>{ self.getEthereumNetwork() }</p>
                                <p className="text-center mt-3" style={{fontSize: 11}}>{ self.getAddress()  }</p>
                                <hr className="mt-4"/>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        </div>
    }

}

export default Dapp