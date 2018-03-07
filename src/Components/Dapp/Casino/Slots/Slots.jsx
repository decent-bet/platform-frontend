import React, {Component, Fragment} from 'react'
import { CircularProgress, MuiThemeProvider } from 'material-ui'
import SlotsGameCard from './SlotsGameCard'
import SlotsChannelList from './SlotChannelList'
import ChipToolbar from './ChipToolbar'

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

const constants = require('./../../../Constants')
const themes = new Themes()

class Slots extends Component {

    constructor(props) {
        super(props)
        this.state = {
            address: helper.getWeb3().eth.defaultAccount,
            currentSession: null,
            allowance: null,
            channels: {},
            balances: {},
            isDialogNewChannelOpen: false,
            isDialogGetChipsOpen: false,
            isDialogWithdrawChipsOpen: false
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
        this.initCurrentSession()
        this.initAllowance()
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
                        self.initCurrentSessionBalance(event.args.session.toNumber())
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
                        self.initCurrentSessionBalance(event.args.session.toNumber())
                    }
                })
            }
        }
    }

    // Starts the current session
    initCurrentSession = async () => {
        try {
            let session = await helper
                .getContractHelper().getWrappers().slotsChannelManager().currentSession()
            session = session.toNumber()
            console.log('Current session', session)
            this.setState({ currentSession: session })
            this.initCurrentSessionBalance(session)
        } catch (err){
            console.log('Error retrieving current session', err.message)
        }
    }

    // Get the current session balance
    initCurrentSessionBalance = async session => {
        try {
            let balance = await helper.getContractHelper().getWrappers().slotsChannelManager()
                .balanceOf(helper.getWeb3().eth.defaultAccount, session)
            let balances = this.state.balances
            balances[session] = balance.toFixed()
            console.log('Balances', balances)
            this.setState({ balances: balances })
        } catch (err){
            console.log('Error retrieving balance', err.message)
        }
    }

    // Get the allowance
    initAllowance = async () => {

        let contractHelper = helper.getContractHelper()
        let defaultAccount = helper.getWeb3().eth.defaultAccount
        let slotsAddress = contractHelper.getSlotsChannelManagerInstance().address

        console.log('Retrieving allowance', defaultAccount, slotsAddress)
        try {
            let allowance = await contractHelper.getWrappers().token().allowance(defaultAccount, slotsAddress)
            console.log('Successfully retrieved slots channel manager allowance', allowance)
            this.setState({ allowance: allowance.toFixed() })
        } catch (err) {
            console.log('Error retrieving slots channel manager allowance', err.message)
        }
    }

    // Create a state channel
    createChannel = async deposit => {
        console.log('Creating channel with deposit', deposit)
        try {
            let tx = await helper.getContractHelper().getWrappers().slotsChannelManager().createChannel(deposit)
            console.log('Successfully sent create channel tx', tx)
            helper.toggleSnackbar('Successfully sent create channel transaction')
        } catch (err) {
            console.log('Error creating new channel', err.message)
        }
    }

    // Send a deposit transaction to channel
    depositToChannel = id => {
        console.log('Depositing to channel',
            id, 'with deposit', this.state.channels[id].initialDeposit)
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
    }

    // Increase allowance and then deposit new Chips
    approveAndDeposit = async amount => {
        console.log('Approving', amount, 'for Slots Channel Manager')
        try {
            let contractHelper = helper.getContractHelper()
            let contractAddress = contractHelper.getSlotsChannelManagerInstance().address
            let tx = await contractHelper.getWrappers().token().approve(contractAddress, amount)
            console.log('Successfully sent approve tx', tx)
            this.depositChips(amount)
            helper.toggleSnackbar('Successfully sent approve transaction')
            return null
        } catch (err) {
            console.log('Error sending approve tx', err.message)
        }
    }

    // Deposit new Chips, sourced from wallet's tokens
    depositChips = async amount => {
        console.log('Depositing', amount, 'to Slots Channel Manager')
        try {
            let tx = await helper.getContractHelper().getWrappers().slotsChannelManager().deposit(amount)
            console.log('Successfully sent deposit tx', tx)
            helper.toggleSnackbar('Successfully sent deposit transaction')
        } catch (err) {
            console.log('Error sending deposit tx', err.message)
        }
    }

    // Withdraw Chips and return them as Tokens to the Wallet
    withdrawChips = async (amount, session) => {
        try {
            let tx = await helper.getContractHelper().getWrappers().slotsChannelManager().withdraw(amount, session)
            console.log('Successfully sent withdraw tx', tx)
            helper.toggleSnackbar('Successfully sent withdraw transaction')
        } catch (err) {
            console.log('Error sending withdraw tx', err.message)
        }
    }

    // How many Chips are in the session? if session isn't open, print `placeholder`
    getChipBalance(placeholder=null){
        if (this.state.currentSession >= 0){
            if (this.state.balances[this.state.currentSession] >= 0){
                // Session is open. Print token total
                let sessionString = this.state.balances[this.state.currentSession].toString()
                return helper.getWeb3().utils.fromWei(sessionString)
            }
        }

        // Session not open. Print Placeholder
        return placeholder
    }

    // Create a new Channel
    onCreateChannelListener = deposit => {
        this.createChannel(deposit.toString())
        this.onNewChannelDialogToggleListener(false)
    }

    // Opens the New Channel Dialog
    onNewChannelDialogOpenListener = () => this.onNewChannelDialogToggleListener(true)
    onNewChannelDialogToggleListener = isOpen => this.setState({ isDialogNewChannelOpen: isOpen })

    // Click the Slots Card
    onSlotsGameClickedListener = () => this.onNewChannelDialogOpenListener(true)
    
    // Opens the dialog to withdraw chips
    onWithdrawChipsDialogOpenListener = () => this.onWithdrawChipsDialogToggleListener(true)
    onWithdrawChipsDialogToggleListener = isOpen => this.setState({ isDialogWithdrawChipsOpen: isOpen })

    // Withdraw Chips from the State Channel
    onWithdrawChipsListener = amount => {
        console.log('onWithdrawChips', amount, this.state.balances[this.state.currentSession])
        let balance = new BigNumber(this.state.balances[this.state.currentSession])
        if (balance.greaterThanOrEqualTo(amount)){
            this.withdrawChips(amount.toString(), this.state.currentSession)
        }
        this.onWithdrawChipsDialogToggleListener(false)
    }
    
    // Opens the Dialog to deposits tokens and transform them into Chips
    onGetChipsDialogOpenListener = () => this.onGetChipsDialogToggleListener(true)
    onGetChipsDialogToggleListener = isOpen => this.setState({ isDialogGetChipsOpen: isOpen })

    // Deposit Tokens and convert them to Chips
    onGetChipsListener = amount => {
        let allowance = new BigNumber(this.state.allowance)
        if (allowance.lessThan(amount)){
            this.approveAndDeposit(amount.toString())
        } else {
            this.depositChips(amount.toString())
        }
        this.onGetChipsDialogToggleListener(false)
    }

    renderChannelList = () => {
        // Prints the amount of available Chips, or a loader component
        let chipBalance = this.getChipBalance()
        let chipsLabel = chipBalance 
            ? `${chipBalance} DBETs` 
            : <CircularProgress size={18} color={constants.COLOR_GOLD}/>
        
        return (
            <div className="row channels">
                <div className="col-12">
                    <ChipToolbar
                        onWithdrawChipsListener={this.onWithdrawChipsDialogOpenListener}
                        onGetChipsListener={this.onGetChipsDialogOpenListener}
                        chipsLabel={chipsLabel}
                    />
                </div>
                <div className="col-12 mt-4">
                    <SlotsChannelList
                        stateChannels={this.state.channels}
                        onDepositToChannelListener={this.depositToChannel}
                    />
                </div>
            </div>
        )
    }

    renderDialogs = () => (
        <Fragment>
            <WithdrawSlotsChipsDialog
                open={this.state.isDialogWithdrawChipsOpen}
                balance={this.getChipBalance('')}
                onWithdrawChips={this.onWithdrawChipsListener}
                toggleDialog={this.onWithdrawChipsDialogToggleListener}
            />
            <GetSlotsChipsDialog
                open={this.state.isDialogGetChipsOpen}
                allowance={this.state.allowance}
                onGetChips={this.onGetChipsListener}
                toggleDialog={this.onGetChipsDialogToggleListener}
            />
            <NewChannelDialog
                open={this.state.isDialogNewChannelOpen}
                onCreateChannel={this.onCreateChannelListener}
                toggleDialog={this.onNewChannelDialogToggleListener}
            />
        </Fragment>
    )

    render() {
        return (
            <MuiThemeProvider muiTheme={themes.getMainTheme()}>
                <main className="slots">
                    <div className="container">

                        <div className="row">
                            <div className="col">
                                <div className="top">
                                    <img src={process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.svg'} className="logo"/>
                                    <h3 className="text-center mt-3">SLOTS</h3>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12" style={{marginTop: 30}}>
                                <div className="intro">
                                    <h5 className="text-center text-uppercase">Select a slot machine from the variety <span
                                        className="text-gold">Decent.bet </span> offers to start a new channel</h5>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12" style={{marginTop: 45}}>
                                <SlotsGameCard
                                    imageUrl='backgrounds/slots-crypto-chaos.png'
                                    onClickListener={this.onSlotsGameClickedListener}
                                />
                            </div>
                        </div>

                        { this.renderChannelList() }
                        { this.renderDialogs() }
                    </div>
                </main>
            </MuiThemeProvider>
        )
    }

}

export default Slots