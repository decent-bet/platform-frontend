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

import Lounge from './Lounge/Lounge'
import House from './House/House'

import './dapp.css'

const VIEW_LOUNGE = 0, VIEW_CASINO = 1, VIEW_SPORTSBOOK = 2, VIEW_HOUSE = 3

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
            balance: 0,
            drawer: {
                open: false
            },
            selectedView: VIEW_HOUSE
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        this.web3Getters().ethereumNetwork()
        this.web3Getters().balances()
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
                    case VIEW_LOUNGE:
                        return <Lounge/>
                    case VIEW_HOUSE:
                        return <House/>
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
                    onRequestChange={(open) => self.helpers().toggleDrawer(open)}
                >
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
                                self.helpers().selectView(VIEW_LOUNGE)
                            }}>
                            <span className="fa fa-dashboard menu-icon"/>&ensp;&ensp;LOUNGE
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                self.helpers().selectView(VIEW_CASINO)
                            }}>
                            <span className="fa fa-gamepad menu-icon"/>&ensp;&ensp;CASINO
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                self.helpers().selectView(VIEW_SPORTSBOOK)
                            }}>
                            <span className="fa fa-soccer-ball-o menu-icon"/>&ensp;&ensp;SPORTSBOOK
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                self.helpers().selectView(VIEW_HOUSE)
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