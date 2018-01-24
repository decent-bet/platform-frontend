import React, {Component} from 'react'

import {AppBar, Drawer, FlatButton, MenuItem, MuiThemeProvider} from 'material-ui'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import {browserHistory} from 'react-router'

import EventBus from 'eventing-bus'
import KeyHandler from '../../Base/KeyHandler'

import Balances from '../Balances/Balances'
import Casino   from '../Casino/Casino'
import House    from '../House/House'
import Game     from '../Casino/Slots/Game'
import Slots    from '../Casino/Slots/Slots'
import Portal   from '../Portal/Portal'

import './dashboard.css'

import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import Helper from '../../Helper'
import Loading from '../../Base/Loading'
import Themes from '../../Base/Themes'

const helper = new Helper()
const keyHandler = new KeyHandler()
const themes = new Themes()

const constants = require('../../Constants')
const styles = require('../../Base/styles').styles()

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
            selectedView: props.view,
            web3Loaded: true,
            dialogs: {
                web3NotLoaded: {
                    open: true
                }
            }
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        const self = this
        if (window.web3Loaded) {
            self.onWeb3Loaded()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                self.onWeb3Loaded()
                // Unregister callback
                web3Loaded()
            })
        }

        let web3NotLoaded = EventBus.on('web3NotLoaded', () => {
            self.setState({
                web3Loaded: false
            })
            web3NotLoaded()
        })
    }

    onWeb3Loaded = () => {
        this.setState({
            web3Loaded: true,
            address: helper.getWeb3().eth.defaultAccount
        })
        this.initWeb3Data()
        this.initWatchers()
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
                helper.getWeb3().eth.net.getId((err, netId) => {
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
                    helper.toggleSnackbar('Successfully sent faucet transaction')
                }).catch((err) => {
                    helper.toggleSnackbar('Error sending faucet transaction')
                    console.log('Error sending faucet tx', err.message)
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
            selectView: (view) => {
                if (view == self.state.selectedView) return
                browserHistory.push(view)
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
                        self.views().appbarOptions()
                    }
                />
            },
            appbarOptions: () => {
                return <div>
                    <FlatButton
                        className="hidden-md-down mr-2"
                        label={
                            <CopyToClipboard text={self.state.address}
                                             onCopy={() =>
                                                 helper.toggleSnackbar('Copied address to clipboard')
                                             }>
                                <span>Address: {self.state.address}</span>
                            </CopyToClipboard>}
                        labelStyle={styles.addressLabel}
                    />
                    <button className="btn btn-sm btn-primary hvr-fade"
                            style={styles.appbarButton}
                            onClick={ () => {
                                self.web3Setters().faucet()
                            }}>{'Claim Faucet'}
                    </button>
                    <button className="btn btn-sm btn-primary hvr-fade"
                            style={styles.appbarButton}>
                        { 'Balance: ' + self.helpers().getFormattedBalance() + ' DBETs' }
                    </button>
                </div>
            },
            top: () => {
                return <div className="main">
                    { self.views().selected() }
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
                            className={(self.state.selectedView === constants.VIEW_CASINO ||
                            self.state.selectedView === constants.VIEW_SLOTS ||
                            self.state.selectedView === constants.VIEW_SLOTS_GAME) ?
                                "menu-item selected" : "menu-item" }
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
                                keyHandler.clear()
                                browserHistory.push('/login')
                            }}>
                            <span className="fa fa-sign-out menu-icon"/>&ensp;&ensp;LOGOUT
                        </MenuItem>
                    </div>
                </Drawer>
            },
            selected: () => {
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
            web3NotLoaded: () => {
                return <div className="container">
                    <div className="row" style={{
                        paddingTop: '45vh'
                    }}>
                        <div className="col">
                            <h3 className="text-center">Oops, looks like you don't have a local Rinkeby node setup.
                                Please set one up with an open RPC port @ 8545 and try again.</h3>
                        </div>
                    </div>
                </div>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            web3NotLoaded: () => {
                return <ConfirmationDialog
                    open={self.state.dialogs.web3NotLoaded.open}
                    title="Not connected to Web3 Provider"
                    message={"Looks like you aren't connected to a local Rinkeby node. " +
                    "Please setup a local node with an open RPC port @ 8545 and try again."}
                />
            }
        }
    }

    render() {
        const self = this
        return <MuiThemeProvider muiTheme={themes.getAppBar()}>
            <div className="dashboard">
                {   self.state.web3Loaded &&
                <section>
                    { self.views().appbar() }
                    { self.views().top() }
                    { self.views().drawer() }
                </section>
                }
                {   !self.state.web3Loaded &&
                <section>
                    {self.dialogs().web3NotLoaded()}
                </section>
                }
            </div>
        </MuiThemeProvider>
    }

}

export default Dashboard