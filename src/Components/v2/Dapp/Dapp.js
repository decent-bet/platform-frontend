/**
 * Created by user on 8/20/2017.
 */

import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import Themes from '../Base/Themes'
import Loading from '../Base/Loading'

import ContractHelper from '../ContractHelper'
import Helper from '../Helper'

const contractHelper = new ContractHelper()
const helper = new Helper()
const themes = new Themes()

const constants = require('./../Constants')

import Casino from './Casino/Casino'
import House from './House/House'
import Balances from './Balances/Balances'
import Slots from './Casino/Slots/Slots'
import Game from './Casino/Slots/Game'

import './dapp.css'

const styles = {
    menuItem: {
        color: constants.COLOR_WHITE,
        fontFamily: 'GothamLight',
        fontSize: 17,
        padding: '10px 0 10px 0'
    }
}

class Dapp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ethNetwork: 0,
            address: helper.getWeb3().eth.defaultAccount,
            balance: 0,
            drawer: {
                open: false
            },
            selectedView: this.props.route.view
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    initData = () => {
        this.web3Getters().ethereumNetwork()
        this.web3Getters().balances()
    }

    initWatchers = () => {
        this.watchers().transferFrom()
        this.watchers().transferTo()
    }

    web3Getters = () => {
        const self = this
        return {
            ethereumNetwork: () => {
                helper.getWeb3().version.getNetwork((err, netId) => {
                    self.setState({
                        ethNetwork: netId
                    })
                })
            },
            balances: () => {
                contractHelper.getWrappers().token().balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                    self.setState({
                        balance: balance
                    })
                })
            }
        }
    }

    web3Setters = () => {
        const self = this
        return {
            faucet: () => {
                contractHelper.getWrappers().token().faucet().then((tx) => {
                    console.log('Sent faucet tx', tx)
                })
            }
        }
    }

    watchers = () => {
        const self = this
        return {
            transferFrom: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, true).watch((err, event) => {
                    console.log('transferFrom', err, JSON.stringify(event))
                    if (!err) {
                        self.web3Getters().balances()
                    }
                })
            },
            transferTo: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, false).watch((err, event) => {
                    console.log('transferTo', err, JSON.stringify(event))
                    if (!err) {
                        self.web3Getters().balances()
                    }
                })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            getEthereumNetwork: () => {
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
            },
            getFormattedBalance: () => {
                if (self.state.balance)
                    return helper.roundDecimals(helper.formatEther(self.state.balance), 4)
                else
                    return 0
            },
            toggleDrawer: (open) => {
                let drawer = self.state.drawer
                drawer.open = open
                self.setState({
                    drawer: drawer
                })
            },
            getSelectedView: () => {
                switch (self.state.selectedView) {
                    case constants.DAPP_VIEW_CASINO:
                        return <Casino/>
                    case constants.DAPP_VIEW_HOUSE:
                        return <House/>
                    case constants.DAPP_VIEW_BALANCES:
                        return <Balances/>
                    case constants.DAPP_VIEW_SLOTS:
                        return <Slots/>
                    case constants.DAPP_VIEW_SLOTS_GAME:
                        return <Game/>
                }
            },
            selectView: (view) => {
                if (view == self.state.selectedView) return
                self.setState({
                    selectedView: view,
                    drawer: {
                        open: false
                    }
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            appbar: () => {
                return <AppBar
                    zDepth={4}
                    style={{
                        position: 'fixed',
                        top: 0
                    }}
                    className="appbar"
                    showMenuIconButton={true}
                    onLeftIconButtonTouchTap={() => {
                        self.helpers().toggleDrawer(!self.state.drawer.open)
                    }}
                    title={
                        <div className="appbar-title">
                            <a href="/">
                                <img src={process.env.PUBLIC_URL + "/assets/img/logos/dbet-white.png"}
                                     className="logo"/>
                            </a>
                        </div>
                    }
                    iconElementRight={
                        <div>
                            <button className="btn btn-sm btn-primary hvr-fade"
                                    style={{
                                        fontSize: 12,
                                        marginTop: 12.5,
                                        marginRight: 10,
                                        fontFamily: 'Lato',
                                        color: constants.COLOR_WHITE
                                    }}
                                    onClick={ () => {
                                        self.web3Setters().faucet()
                                    }}>{ 'Claim Faucet'}
                            </button>
                            <button className="btn btn-sm btn-primary hvr-fade"
                                    style={{
                                        fontSize: 12,
                                        marginTop: 12.5,
                                        marginRight: 10,
                                        fontFamily: 'Lato',
                                        color: constants.COLOR_WHITE
                                    }}>{ 'Balance: ' + self.helpers().getFormattedBalance() + ' DBETs' }
                            </button>
                        </div>
                    }
                />
            },
            top: () => {
                return <div className="main">
                    { self.helpers().getSelectedView() }
                </div>
            },
            drawer: () => {
                return <Drawer
                    docked={false}
                    width={300}
                    open={self.state.drawer.open}
                    onRequestChange={(open) => self.helpers().toggleDrawer(open)}>
                    <div className="container drawer">
                        <div className="row">
                            <div className="col">
                                <img className="logo"
                                     src={process.env.PUBLIC_URL + "/assets/img/logos/dbet-white.png"}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                self.helpers().selectView(constants.DAPP_VIEW_BALANCES)
                            }}>
                            <span className="fa fa-money menu-icon"/>&ensp;&ensp;BALANCES
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                self.helpers().selectView(constants.DAPP_VIEW_CASINO)
                            }}>
                            <span className="fa fa-gamepad menu-icon"/>&ensp;&ensp;CASINO
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                self.helpers().selectView(constants.DAPP_VIEW_SPORTSBOOK)
                            }}>
                            <span className="fa fa-soccer-ball-o menu-icon"/>&ensp;&ensp;SPORTSBOOK
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                self.helpers().selectView(constants.DAPP_VIEW_HOUSE)
                            }}>
                            <span className="fa fa-home menu-icon"/>&ensp;&ensp;HOUSE
                        </MenuItem>
                    </div>
                </Drawer>
            }
        }
    }

    render() {
        const self = this
        return <MuiThemeProvider muiTheme={themes.getAppBar()}>
            <div className="dapp">
                { self.views().appbar() }
                { self.views().top() }
                { self.views().drawer() }
            </div>
        </MuiThemeProvider>
    }

}

export default Dapp