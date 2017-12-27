import React, {Component} from 'react'

import {AppBar, Drawer, MenuItem, MuiThemeProvider} from 'material-ui'

import {browserHistory} from 'react-router'

import EventBus from 'eventing-bus'

import Balances from '../Balances/Balances'
import Casino   from '../Casino/Casino'
import House    from '../House/House'
import Game     from '../Casino/Slots/Game'
import Slots    from '../Casino/Slots/Slots'
import Portal   from '../Portal/Portal'

import './dashboard.css'

import Helper from '../../Helper'
import Loading from '../../Base/Loading'
import Themes from '../../Base/Themes'

const helper = new Helper()
const themes = new Themes()

const constants = require('../../Constants')

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ethNetwork: 0,
            address: helper.getWeb3().eth.defaultAccount,
            balance: 0,
            drawer: {
                open: false
            },
            selectedView: props.view
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        if (window.web3Loaded) {
            this.initWeb3Data()
            this.initWatchers()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.initWeb3Data()
                this.initWatchers()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initWeb3Data = () => {
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
                helper.getContractHelper().getWrappers().token()
                    .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
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
                helper.getContractHelper().getWrappers().token()
                    .faucet().then((tx) => {
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
                    case constants.VIEW_CASINO:
                        return <Casino/>
                    case constants.VIEW_HOUSE:
                        return <House/>
                    case constants.VIEW_BALANCES:
                        return <Balances/>
                    case constants.VIEW_PORTAL:
                        return <Portal/>
                    case constants.VIEW_SLOTS:
                        return <Slots/>
                    case constants.VIEW_SLOTS_GAME:
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
                            className={self.state.selectedView === constants.VIEW_BALANCES ? "menu-item selected" : "menu-item" }
                            onClick={() => {
                                self.helpers().selectView(constants.VIEW_BALANCES)
                            }}>
                            <span className="fa fa-money menu-icon"/>&ensp;&ensp;BALANCES
                        </MenuItem>
                        <MenuItem
                            className={self.state.selectedView === constants.VIEW_CASINO ? "menu-item selected" : "menu-item" }
                            onClick={() => {
                                self.helpers().selectView(constants.VIEW_CASINO)
                            }}>
                            <span className="fa fa-gamepad menu-icon"/>&ensp;&ensp;CASINO
                        </MenuItem>
                        <MenuItem
                            className={self.state.selectedView === constants.VIEW_PORTAL ? "menu-item selected" : "menu-item" }
                            onClick={() => {
                                self.helpers().selectView(constants.VIEW_PORTAL)
                            }}>
                            <span className="fa fa-soccer-ball-o menu-icon"/>&ensp;&ensp;PORTAL
                        </MenuItem>
                        <MenuItem
                            className={self.state.selectedView === constants.VIEW_HOUSE ? "menu-item selected" : "menu-item" }
                            onClick={() => {
                                self.helpers().selectView(constants.VIEW_HOUSE)
                            }}>
                            <span className="fa fa-home menu-icon"/>&ensp;&ensp;HOUSE
                        </MenuItem> 
                        <MenuItem
                            className="menu-item"
                            onClick={() => {
                                browserHistory.push('/logout')
                            }}>
                            <span className="fa fa-sign-out menu-icon"/>&ensp;&ensp;LOGOUT
                        </MenuItem> 
                    </div>
                </Drawer>
            }
        }
    }

    render() {
        const self = this
        return <MuiThemeProvider muiTheme={themes.getAppBar()}>
            <div className="dashboard">
                { self.views().appbar() }
                { self.views().top() }
                { self.views().drawer() }
            </div>
        </MuiThemeProvider>
    }

}

export default Dashboard