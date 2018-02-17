import React, {Component} from 'react'

import {Card, CircularProgress, FlatButton, MuiThemeProvider} from 'material-ui'

import GetSlotsChipsDialog from './Dialogs/GetSlotsChipsDialog'
import NewChannelDialog from './Dialogs/NewChannelDialog'
import WithdrawSlotsChipsDialog from './Dialogs/WithdrawSlotsChipsDialog'

import EventBus from 'eventing-bus'
import Helper from '../../../Helper'
import SlotsChannelHandler from './Libraries/SlotsChannelHandler'
import Themes from '../../../Base/Themes'

import './slots.css'

const BigNumber = require('bignumber.js')
const helper = new Helper()
const slotsChannelHandler = new SlotsChannelHandler()
const themes = new Themes()

const constants = require('./../../../Constants')

const styles = require('../../../Base/styles').styles()
styles.card.padding = 0
styles.card.borderRadius = 15
styles.button = {
    fontSize: 12,
    marginTop: 12.5,
    marginRight: 10,
    fontFamily: 'Lato',
    color: constants.COLOR_WHITE
}

const DIALOG_NEW_CHANNEL = 0, DIALOG_GET_CHIPS = 1, DIALOG_WITHDRAW_CHIPS = 2

class Slots extends Component {

    constructor(props) {
        super(props)
        this.state = {
            address: helper.getWeb3().eth.defaultAccount,
            currentSession: null,
            allowance: null,
            channels: {},
            balances: {},
            dialogs: {
                newChannel: {
                    open: false
                },
                getChips: {
                    open: false
                },
                withdrawChips: {
                    open: false
                }
            }
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
        this.web3Getters().currentSession()
        this.web3Getters().allowance()
    }

    initWatchers = () => {
        this.watchers().newChannel()
        this.watchers().deposit()
        this.watchers().withdraw()
    }

    watchers = () => {
        const self = this
        return {
            newChannel: () => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logNewChannel().watch((err, event) => {
                    if (err)
                        console.log('New channel event error', err)
                    else {
                        let id = event.args.id.toNumber()
                        let user = event.args.user.toString()
                        console.log('New channel event', id, user, helper.getWeb3().eth.defaultAccount)

                        let channels = self.state.channels
                        if (!channels.hasOwnProperty(id)) {
                            channels[id] = {}
                            channels[id].status = constants.CHANNEL_STATUS_WAITING
                        }
                        console.log('Channels', channels)

                        channels[id].initialDeposit = event.args.initialDeposit.toFixed()
                        self.setState({
                            channels: channels
                        })

                        this.watchers().channelDeposit(id)
                        this.watchers().channelActivate(id)
                        this.watchers().channelFinalized(id)
                        this.watchers().claimChannelTokens(id)
                    }
                })
            },
            channelDeposit: (id) => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logChannelDeposit(id).watch((err, event) => {
                    if (err)
                        console.log('Deposit channel event error', err)
                    else {
                        let _id = event.args.id.toString()
                        console.log('Deposit channel event', event.args, _id, id)
                        let channels = self.state.channels
                        if (channels.hasOwnProperty(_id)) {
                            if (channels[_id].status !== constants.CHANNEL_STATUS_ACTIVATED &&
                                channels[_id].status !== constants.CHANNEL_STATUS_FINALIZED)
                                channels[_id].status = constants.CHANNEL_STATUS_DEPOSITED
                            self.setState({
                                channels: channels
                            })
                        }
                    }
                })
            },
            channelActivate: (id) => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logChannelActivate(id).watch((err, event) => {
                    if (err)
                        console.log('Activate channel event error', err)
                    else {
                        let _id = event.args.id.toString()
                        console.log('Activate channel event', event.args, _id, id)
                        let channels = self.state.channels
                        if (channels.hasOwnProperty(_id)) {
                            if (channels[_id].status !== constants.CHANNEL_STATUS_FINALIZED)
                                channels[_id].status = constants.CHANNEL_STATUS_ACTIVATED
                            self.setState({
                                channels: channels
                            })
                        }
                    }
                })
            },
            channelFinalized: (id) => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logChannelFinalized(id).watch((err, event) => {
                    if (err)
                        console.log('Finalized channel event error', err)
                    else {
                        console.log('Finalized channel event', event.args)
                        let _id = event.args.id.toString()
                        console.log('Finalized channel event', event.args, _id, id)
                        let channels = self.state.channels
                        if (channels.hasOwnProperty(_id)) {
                            channels[_id].status = constants.CHANNEL_STATUS_FINALIZED
                            self.setState({
                                channels: channels
                            })
                        }
                    }
                })
            },
            claimChannelTokens: (id) => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logClaimChannelTokens(id).watch((err, event) => {
                    if (err)
                        console.log('Claim channel tokens event error', err)
                    else {
                        console.log('Claim channel tokens event', event.args)
                        let _id = event.args.id.toString()
                        let isHouse = event.args.isHouse
                        let channels = self.state.channels
                        if (channels.hasOwnProperty(_id)) {
                            if (!channels[_id].hasOwnProperty('claimed'))
                                channels[_id].claimed = {}
                            channels[_id].claimed[isHouse] = true
                            self.setState({
                                channels: channels
                            })
                        }
                    }
                })
            },
            deposit: () => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logDeposit().watch((err, event) => {
                    if (err)
                        console.log('Deposit event error', err)
                    else {
                        console.log('Deposit event', event.args)
                        self.web3Getters().balanceOf(event.args.session.toNumber())
                    }
                })
            },
            withdraw: () => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .logWithdraw().watch((err, event) => {
                    if (err)
                        console.log('Withdraw event error', err)
                    else {
                        console.log('Withdraw event', event.args)
                        self.web3Getters().balanceOf(event.args.session.toNumber())
                    }
                })
            }
        }
    }

    web3Getters = () => {
        const self = this
        return {
            currentSession: () => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .currentSession().then((session) => {
                    session = session.toNumber()
                    console.log('Current session', session)
                    self.setState({
                        currentSession: session
                    })
                    /** Init data that depends on current session */
                    self.web3Getters().balanceOf(session)
                }).catch((err) => {
                    console.log('Error retrieving current session', err.message)
                })
            },
            balanceOf: (session) => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .balanceOf(helper.getWeb3().eth.defaultAccount, session).then((balance) => {
                    let balances = self.state.balances
                    balances[session] = balance.toFixed()
                    console.log('Balances', balances)
                    self.setState({
                        balances: balances
                    })
                }).catch((err) => {
                    console.log('Error retrieving balance', err.message)
                })
            },
            allowance: () => {
                console.log('Retrieving allowance',
                    helper.getWeb3().eth.defaultAccount,
                    helper.getContractHelper().getSlotsChannelManagerInstance().address)
                helper.getContractHelper().getWrappers().token().allowance(helper.getWeb3().eth.defaultAccount,
                    helper.getContractHelper().getSlotsChannelManagerInstance().address).then((allowance) => {
                    console.log('Successfully retrieved slots channel manager allowance', allowance)
                    self.setState({
                        allowance: allowance.toFixed()
                    })
                }).catch((err) => {
                    console.log('Error retrieving slots channel manager allowance', err.message)
                })
            }
        }
    }

    web3Setters = () => {
        const self = this
        return {
            createChannel: (deposit) => {
                console.log('Creating channel with deposit', deposit)
                helper.getContractHelper().getWrappers().slotsChannelManager().createChannel(deposit).then((tx) => {
                    console.log('Successfully sent create channel tx', tx)
                    helper.toggleSnackbar('Successfully sent create channel transaction')
                }).catch((err) => {
                    console.log('Error creating new channel', err.message)
                })
            },
            depositToChannel: (id) => {
                console.log('Depositing to channel',
                    id, 'with deposit', self.state.channels[id].initialDeposit)
                slotsChannelHandler.getChannelDepositParams(id, (err, params) => {
                    let initialUserNumber = params.initialUserNumber
                    let finalUserHash = params.finalUserHash

                    console.log('Depositing to channel with hashes', initialUserNumber, finalUserHash)
                    helper.getContractHelper().getWrappers().slotsChannelManager()
                        .depositToChannel(id, initialUserNumber, finalUserHash).then((tx) => {
                        console.log('Successfully sent deposit to channel', id, ' - tx',
                            initialUserNumber, finalUserHash, tx)
                        helper.toggleSnackbar('Successfully sent deposit transaction to channel')
                    }).catch((err) => {
                        console.log('Error sending deposit to channel', err.message)
                    })
                })
                // helper.getContractHelper().getWrappers().slotsChannelManager().depositToChannel(id,)
            },
            approveAndDeposit: (amount) => {
                console.log('Approving', amount, 'for Slots Channel Manager')
                helper.getContractHelper().getWrappers().token()
                    .approve(helper.getContractHelper().getSlotsChannelManagerInstance().address,
                        amount).then((tx) => {
                    console.log('Successfully sent approve tx', tx)
                    self.web3Setters().deposit(amount)
                    helper.toggleSnackbar('Successfully sent approve transaction')
                    return null
                }).catch((err) => {
                    console.log('Error sending approve tx', err.message)
                })
            },
            deposit: (amount) => {
                console.log('Depositing', amount, 'to Slots Channel Manager')
                helper.getContractHelper().getWrappers().slotsChannelManager().deposit(amount).then((tx) => {
                    console.log('Successfully sent deposit tx', tx)
                    helper.toggleSnackbar('Successfully sent deposit transaction')
                }).catch((err) => {
                    console.log('Error sending deposit tx', err.message)
                })
            },
            withdraw: (amount, session) => {
                helper.getContractHelper().getWrappers().slotsChannelManager().withdraw(amount, session).then((tx) => {
                    console.log('Successfully sent withdraw tx', tx)
                    helper.toggleSnackbar('Successfully sent withdraw transaction')
                }).catch((err) => {
                    console.log('Error sending withdraw tx', err.message)
                })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            toggleDialog: (dialog, open) => {
                console.log('Toggle dialog', dialog, open)
                let dialogs = self.state.dialogs
                if (dialog === DIALOG_NEW_CHANNEL)
                    dialogs.newChannel.open = open
                else if (dialog === DIALOG_GET_CHIPS)
                    dialogs.getChips.open = open
                else if (dialog === DIALOG_WITHDRAW_CHIPS)
                    dialogs.withdrawChips.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            getFormattedChannelStatus: (status) => {
                switch (status) {
                    case constants.CHANNEL_STATUS_WAITING:
                        return constants.FORMATTED_CHANNEL_STATUS_WAITING
                    case constants.CHANNEL_STATUS_DEPOSITED:
                        return constants.FORMATTED_CHANNEL_STATUS_DEPOSITED
                    case constants.CHANNEL_STATUS_ACTIVATED:
                        return constants.FORMATTED_CHANNEL_STATUS_ACTIVATED
                    case constants.CHANNEL_STATUS_FINALIZED:
                        return constants.FORMATTED_CHANNEL_STATUS_FINALIZED
                }
            }
        }
    }

    views = () => {
        const self = this
        return {
            top: () => {
                return <div className="row">
                    <div className="col">
                        <div className="top">
                            <img src={process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.png'} className="logo"/>
                            <h3 className="text-center mt-3">SLOTS</h3>
                        </div>
                    </div>
                </div>
            },
            intro: () => {
                return <div className="row">
                    <div className="col-12" style={{marginTop: 30}}>
                        <div className="intro">
                            <h5 className="text-center text-uppercase">Select a slot machine from the variety <span
                                className="text-gold">Decent.bet </span> offers to start a new channel</h5>
                        </div>
                    </div>
                </div>
            },
            slotMachines: () => {
                return <div className="row">
                    <div className="col-12" style={{marginTop: 45}}>
                        { self.views().slotsCard('Crypto Chaos', 'backgrounds/slots-crypto-chaos.png')}
                    </div>
                </div>
            },
            slotsCard: (name, imgUrl) => {
                return <div className="col-6 hvr-float">
                    <Card style={styles.card} className="mb-4">
                        <div style={{
                            background: 'url(' + process.env.PUBLIC_URL + 'assets/img/' + imgUrl + ')',
                            backgroundSize: 'cover',
                            paddingTop: 225,
                            height: 300,
                            borderRadius: styles.card.borderRadius
                        }} onClick={() => {
                            self.helpers().toggleDialog(DIALOG_NEW_CHANNEL, true)
                        }}>
                        </div>
                    </Card>
                </div>
            },
            slotChannelsCard: () => {
                return <div className="row channels">
                    <div className="col-12">
                        {/** Slots chips are merely DBETs that're deposited into the Slots Channel Manager contract
                         and can be withdrawn at any time*/}
                        <button className="btn btn-sm btn-primary hvr-fade float-right"
                                style={styles.button}>
                            Slots chips:
                            <span className="ml-1">{
                                (self.state.currentSession >= 0 &&
                                self.state.balances[self.state.currentSession] >= 0) ?
                                    (helper.getWeb3().utils
                                        .fromWei(self.state.balances[self.state.currentSession].toString()) + ' DBETs') :
                                    self.views().tinyLoader()
                            }
                            </span>
                        </button>
                        <button className="btn btn-sm btn-primary hvr-fade float-right text"
                                style={styles.button}
                                onClick={() => {
                                    self.helpers().toggleDialog(DIALOG_WITHDRAW_CHIPS, true)
                                }}>
                            Withdraw Chips
                        </button>
                        <button className="btn btn-sm btn-primary hvr-fade float-right text"
                                style={styles.button}
                                onClick={() => {
                                    self.helpers().toggleDialog(DIALOG_GET_CHIPS, true)
                                }}>
                            Get slots chips
                        </button>
                    </div>
                    <div className="col-12 mt-4">
                        <Card style={styles.card} className="p-4">
                            <section>
                                <h3 className="text-center text-uppercase mb-3">Open channels</h3>
                                <small className="text-white"><span
                                    className="text-gold font-weight-bold">Decent.bet </span>
                                    relies on "State Channels" to
                                    ensure casino users can enjoy lightning fast games while still being secured by
                                    smart
                                    contracts
                                    on the blockchain. Listed below are channels created from your current address
                                    which can be continued or closed at any point in time.
                                </small>
                                { self.views().slotChannels() }
                            </section>
                        </Card>
                    </div>
                </div>
            },
            slotChannels: () => {
                return <div className="row">
                    <div className="col">
                        <table className="table table-striped mt-4">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Deposit</th>
                                <th>Status</th>
                                <th>Options</th>
                            </tr>
                            </thead>
                            { Object.keys(self.state.channels).length > 0 &&
                            <tbody>
                            {   Object.keys(self.state.channels).map((id, index) =>
                                <tr>
                                    <th scope="row"><p>{id}</p></th>
                                    <td>
                                        <p>
                                            {
                                                self.state.channels.hasOwnProperty(id) &&
                                                self.state.channels[id].hasOwnProperty('initialDeposit') ?
                                                    helper.getWeb3().utils.fromWei(self.state.channels[id]
                                                        .initialDeposit.toString()) :
                                                    self.views().tinyLoader()
                                            } DBETs
                                        </p>
                                    </td>
                                    <td>
                                        <p>{ self.helpers().getFormattedChannelStatus(self.state.channels[id].status) }
                                        </p>
                                    </td>
                                    <MuiThemeProvider muiTheme={themes.getButtons()}>
                                        <td>
                                            <FlatButton
                                                label="Deposit"
                                                disabled={self.state.channels[id].status !==
                                                constants.CHANNEL_STATUS_WAITING}
                                                onClick={() => {
                                                    self.web3Setters().depositToChannel(id)
                                                }}/>

                                            <FlatButton
                                                label="Play"
                                                className="ml-4"
                                                disabled={self.state.channels[id].status !== constants.CHANNEL_STATUS_ACTIVATED}
                                                href={'/slots/game?id=' + id}/>

                                            <FlatButton
                                                label="Claim DBETs"
                                                disabled={
                                                    !(self.state.channels[id].status == constants.CHANNEL_STATUS_FINALIZED && !self.state.channels[id].hasOwnProperty('claimed'))
                                                }
                                                className="ml-4"
                                                href={'/slots/game?id=' + id}/>
                                        </td>
                                    </MuiThemeProvider>
                                </tr>
                            )}
                            </tbody>
                            }
                        </table>
                        {   Object.keys(self.state.channels).length == 0 &&
                        <div className="row">
                            <div className="col">
                                <h5 className="text-center text-uppercase">No channels available yet..</h5>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            },
            tinyLoader: () => {
                return <CircularProgress size={18} color={constants.COLOR_GOLD}/>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            newChannel: () => {
                return <NewChannelDialog
                    open={self.state.dialogs.newChannel.open}
                    onCreateChannel={(deposit) => {
                        self.web3Setters().createChannel(deposit.toString())
                        self.helpers().toggleDialog(DIALOG_NEW_CHANNEL, false)
                    }}
                    toggleDialog={(open) => {
                        self.helpers().toggleDialog(DIALOG_NEW_CHANNEL, open)
                    }}
                />
            },
            getSlotsChips: () => {
                return <GetSlotsChipsDialog
                    open={self.state.dialogs.getChips.open}
                    allowance={self.state.allowance}
                    onGetChips={(amount) => {
                        let allowance = new BigNumber(self.state.allowance)
                        if (allowance.lessThan(amount))
                            self.web3Setters().approveAndDeposit(amount.toString())
                        else
                            self.web3Setters().deposit(amount.toString())
                        self.helpers().toggleDialog(DIALOG_GET_CHIPS, false)
                    }}
                    toggleDialog={(open) => {
                        self.helpers().toggleDialog(DIALOG_GET_CHIPS, open)
                    }}
                />
            },
            withdrawSlotsChips: () => {
                return <WithdrawSlotsChipsDialog
                    open={self.state.dialogs.withdrawChips.open}
                    balance={(self.state.currentSession >= 0 &&
                    self.state.balances[self.state.currentSession] >= 0) ?
                        (helper.getWeb3().utils.fromWei(self.state.balances[self.state.currentSession].toString())) :
                        null}
                    onWithdrawChips={(amount) => {
                        console.log('onWithdrawChips', amount, self.state.balances[self.state.currentSession])
                        let balance = new BigNumber(self.state.balances[self.state.currentSession])
                        if (balance.greaterThanOrEqualTo(amount))
                            self.web3Setters().withdraw(amount.toString(), self.state.currentSession)
                        self.helpers().toggleDialog(DIALOG_WITHDRAW_CHIPS, false)
                    }}
                    toggleDialog={(open) => {
                        self.helpers().toggleDialog(DIALOG_WITHDRAW_CHIPS, open)
                    }}
                />
            }
        }
    }

    render() {
        const self = this
        return <div className="slots">
            <div className="container">
                { self.views().top() }
                { self.views().intro() }
                { self.views().slotMachines() }
                { self.views().slotChannelsCard() }
                { self.dialogs().newChannel() }
                { self.dialogs().getSlotsChips() }
                { self.dialogs().withdrawSlotsChips() }
            </div>
        </div>
    }

}

export default Slots