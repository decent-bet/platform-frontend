import React, {Component, Fragment} from 'react'

import {AppBar, FlatButton, MuiThemeProvider, MenuItem} from 'material-ui'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import DashboardRouter from './DashboardRouter'
import DashboardDrawer from './DashboardDrawer'
import ProviderSelector from './ProviderSelector'

import EventBus from 'eventing-bus'

import './dashboard.css'

import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import KeyHandler from '../../Base/KeyHandler'
import Helper from '../../Helper'
import Themes from '../../Base/Themes'

const helper = new Helper()
const themes = new Themes()
const keyHandler = new KeyHandler()

const styles = require('../../Base/styles').styles()
const constants = require('../../Constants')

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            provider: helper.getGethProvider(),
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
        this.web3Getters().balances()
    }

    initWatchers = () => {
        this.watchers().transferFrom()
        this.watchers().transferTo()
    }

    web3Getters = () => {
        const self = this
        return {
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
                    if (!err) {
                        self.web3Getters().balances()
                    }
                })
            },
            transferTo: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, false).watch((err, event) => {
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
                if (view === self.state.selectedView) return
                self.setState({
                    selectedView: view,
                    drawer: {
                        open: false
                    }
                })
                self.props.history.push(view)
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
                    onLeftIconButtonClick={() => {
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

    onLogoutListener = () => {
        keyHandler.clear()
        this.props.history.push(constants.VIEW_LOGIN)
    }
    onDrawerButtonPressedListener = open => this.helpers().toggleDrawer(open)
    onProviderChangeListener = (event, index, value) => {
        if (value != this.state.provider) {
            helper.setGethProvider(value)
            this.setState({ provider: value })
            // Wait for dropdown animation
            setTimeout(() => {
                window.location.reload()
            }, 500)
        }
    }

    renderDrawer = () => (
        <DashboardDrawer
            isDrawerOpen={this.state.drawer.open}
            onRequestChangeListener={this.onDrawerButtonPressedListener}
            selectedView={this.state.selectedView}
            onLogoutListener={this.onLogoutListener}
            >
            <ProviderSelector
                onProviderChangeListener={this.onProviderChangeListener}
                gethNodeProvider={this.state.provider}
            />
        </DashboardDrawer>
    )

    renderDashboard = () => {
        if (this.state.web3Loaded) {
            return (
                <Fragment>
                    { this.views().appbar() }
                    <div className="main">
                        <DashboardRouter />
                    </div>
                    { this.renderDrawer() }
                </Fragment>
            )
        } else {
            return (
                <ConfirmationDialog
                    open={this.state.dialogs.web3NotLoaded.open}
                    title="Not connected to Web3 Provider"
                    message={"Looks like you aren't connected to a local Rinkeby node. " +
                    "Please setup a local node with an open RPC port @ 8545 and try again."}
                />
            )
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="dashboard">
                    { this.renderDashboard() }
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Dashboard