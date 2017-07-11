/**
 * Created by user on 5/24/2017.
 */

import React, {Component} from 'react'
import $ from 'jquery'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'

import Authorized from './Authorized/Authorized'
import Games from './Games/Games'

import ContractHelper from './../ContractHelper'
import Helper from './../Helper'
import Loading from './../Base/Loading'
import Themes from './../Base/Themes'

const contractHelper = new ContractHelper()
const helper = new Helper()
const themes = new Themes()

const constants = require('./../Constants')

const PAGE_AUTHORIZED = 'authorized', PAGE_GAMES = 'games', PAGE_SETTINGS = 'settings'

import './admin-panel.css'

class AdminPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            accounts: [],
            amountRaised: 0,
            tokensSold: 0,
            ethNetwork: 0,
            selectedPage: PAGE_AUTHORIZED,
            authorized: false
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
        self.initTokenDiv(helper.getContractHelper().getTokenInstance())
        self.initAuthorized()
        console.log('House: ' + helper.getContractHelper().getInstance(1).address)
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

    initAuthorized = (index) => {
        const self = this
        let _index = index ? index : 0
        contractHelper.getWrappers().house().getAuthorizedAddresses(_index).then((address) => {
            console.log('getAuthorizedAddresses: ' + JSON.stringify(address))
            // Loop through array indices
            if (address != '0x') {
                if (address == helper.getWeb3().eth.accounts[0])
                    self.setState({
                        authorized: true
                    })
                self.getAuthorizedAddress(_index + 1)
            }
        }).catch((err) => {
            // End of array
        })
    }

    getSidebarLink = (title, page) => {
        const self = this
        return <li>
            <a href="#"
               className={
                   self.state.selectedPage == page ? 'selected' : ''
               }
               onClick={() => {
                   self.setState({
                       selectedPage: page
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
            case PAGE_AUTHORIZED:
                return <Authorized/>
            case PAGE_GAMES:
                return <Games/>
            default:
                return <Authorized/>
        }
    }

    render() {
        const self = this
        return <div>
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="admin" style={{backgroundColor: '#F7F8FB'}}>
                    <AppBar
                        zDepth={2}
                        style={{
                            backgroundColor: constants.COLOR_PRIMARY,
                            position: 'fixed',
                            top: 0
                        }}
                        showMenuIconButton={false}
                        title={<a href="/" className="text-white font-weight-bold hvr-shrink"
                                  style={{fontFamily: 'Lato', textDecoration: 'none', fontSize: 19}}>decent.bet
                            <span style={{fontSize: 14}}> admin</span></a>}
                        iconElementRight={
                            <div>
                                <button className="btn btn-sm btn-primary hvr-fade"
                                        style={{fontSize: 12, marginTop: 12.5, marginRight: 10, fontFamily: 'Lato'}}>
                                    { self.state.authorized ? 'Authorized' : 'Not Authorized'}
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
                                            {helper.formatHeading('Admin_Menu')}
                                        </p>
                                        { self.getSidebarLink('Authorized', PAGE_AUTHORIZED)}
                                        { self.getSidebarLink('Games', PAGE_GAMES)}
                                        { self.getSidebarLink('Settings', PAGE_SETTINGS)}
                                        <hr className="mt-4"/>
                                    </ul>
                                </div>
                                <div id="page-content-wrapper">
                                    { self.getSelectedPage() }
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

export default AdminPanel