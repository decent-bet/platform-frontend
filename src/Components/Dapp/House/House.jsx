/**
 * Created by user on 8/21/2017.
 */

import React, { Component, Fragment } from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { RaisedButton, Card, CardText, CardActions } from 'material-ui'
import PurchaseCreditsDialog from './Dialogs/PurchaseCreditsDialog'
import EventBus from 'eventing-bus'
import Helper from '../../Helper'
import HouseStats from './HouseStats'
import LotteryDetails from './LotteryDetails'
import LotteryTicketsCard from './LotteryTicketsCard'
import SessionStats from './SessionStats'
import { BigNumber } from 'bignumber.js'

import './house.css'

const ethUnits = require('ethereum-units')
const helper = new Helper()

export default class House extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSession: 0,
            allowance: 0,
            balance: 0,
            sessions: {},
            credits: {},
            addresses: {
                authorized: []
            },
            houseFunds: {},
            lotteries: {},
            isDialogPurchaseCreditsOpen: false
        }
    }

    componentWillMount = () => {
        if (window.web3Loaded) {
            this.initData()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.initData()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initData = () => {
        this.initCurrentSessionID()
        this.initAuthorizedAddresses(0, true)
        this.initHouseAllowance()
        this.initDbetBalance()
        this.watcherTransfer()
    }

    /**
     * Watches for purchased credits and updates when called.
     * @param sessionNumber Session Number
     */
    watcherPurchasedCredits = async sessionNumber => {
        let listener = (err, event) => {
            if (err) {
                console.log('Purchased credits event error: ' + err)
            } else {
                let balance = event.args.balance
                let credits = this.state.credits
                credits[sessionNumber] = balance.toFixed(0)
                this.setState({ credits: credits })
                this.initSessionData(this.currentSessionID())
                console.log('Purchased credits event: ', event)
            }
        }

        helper
            .getContractHelper()
            .getWrappers()
            .house()
            .logPurchasedCredits(sessionNumber, 'latest')
            .watch(listener)
    }

    /**
     * Watcher for all transfers in this wallet
     */
    watcherTransfer = () => {
        //Listener for both watchers
        let listener = (err, event) => {
            console.log('transferFrom', err, JSON.stringify(event))
            if (!err) {
                this.initDbetBalance()
            }
        }

        // Transfer For
        helper
            .getContractHelper()
            .getWrappers()
            .token()
            .logTransfer(this.state.address, true)
            .watch(listener)

        // Transter To
        helper
            .getContractHelper()
            .getWrappers()
            .token()
            .logTransfer(this.state.address, false)
            .watch(listener)
    }

    /**
     * intializes the current House Session ID
     */
    initCurrentSessionID = async () => {
        try {
            let session = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .getCurrentSession()

            session = session.toFixed(0)
            this.setState({ currentSession: session })
            this.initSessionData(this.currentSessionID())
            this.watcherPurchasedCredits(this.currentSessionID())
        } catch (err) {
            console.log('Error retrieving current session')
        }
    }

    /**
     * Iterates over authorized addresses available in the house contract.
     * @param index
     * @param iterate
     */
    initAuthorizedAddresses = async (index, iterate) => {
        try {
            let address = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .getAuthorizedAddresses(index)
            if (address !== '0x') {
                let addresses = this.state.addresses
                addresses.authorized.push(address)
                this.setState({ addresses: addresses })
                if (iterate) {
                    this.authorizedAddresses(index + 1, true)
                }
            }
        } catch (err) {
            console.log('Error retrieving authorized address', index, iterate)
        }
    }

    /**
     * Retrieves the users credits for a session
     * @param sessionNumber
     */
    getUserCreditsForSession = async sessionNumber => {
        try {
            let defaultAccount = helper.getWeb3().eth.defaultAccount
            let userCredits = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .getUserCreditsForSession(sessionNumber, defaultAccount)

            // 0 - Amount, 1 - Liquidated, 2 - Rolled over, 3 - Exists
            console.log('getUserCreditsForSession', userCredits[0].toFixed(0))
            let credits = this.state.credits
            credits[sessionNumber] = userCredits[0].toFixed(0)
            this.setState({ credits: credits })
        } catch (err) {
            console.log(
                'Error retrieving user credits for session',
                sessionNumber
            )
        }
    }

    /**
     * Retrieve session details - Start time, end time and isActive
     * @param sessionNumber
     */
    initSessionDetails = async sessionNumber => {
        try {
            let session = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .getSession(sessionNumber)

            let sessions = this.state.sessions

            let _session = {}
            _session.startTime = session[0].toFixed(0)
            _session.endTime = session[1].toFixed(0)
            _session.active = session[2]
            sessions[sessionNumber] = _session

            this.setState({ sessions: sessions })
        } catch (err) {
            console.log('Error retrieving session details', sessionNumber)
        }
    }

    /**
     * Retrieve house fund details for a session - Total funds, purchased user credits, user credits
     * available, house payouts, withdrawn and profit
     * @param sessionNumber
     */
    initHouseFunds = async sessionNumber => {
        try {
            let houseFunds = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .getHouseFunds(sessionNumber)

            houseFunds = {
                totalFunds: houseFunds[0].toFixed(0),
                totalPurchasedUserCredits: houseFunds[1].toFixed(0),
                totalUserCredits: houseFunds[2].toFixed(0),
                totalHousePayouts: houseFunds[3].toFixed(0),
                totalWithdrawn: houseFunds[4].toFixed(0),
                profit: houseFunds[5].toFixed(0)
            }
            let _houseFunds = this.state.houseFunds
            _houseFunds[sessionNumber] = houseFunds
            console.log('houseFunds', JSON.stringify(_houseFunds))
            this.setState({ houseFunds: _houseFunds })
        } catch (err) {
            console.log('Error retrieving house funds', sessionNumber, err)
        }
    }

    /**
     * Returns the allowance assigned to the house for DBETs assigned to the user's ETH address
     */
    initHouseAllowance = async () => {
        try {
            let allowance = await helper
                .getContractHelper()
                .getWrappers()
                .token()
                .allowance(
                    helper.getWeb3().eth.defaultAccount,
                    helper.getContractHelper().getHouseInstance().address
                )

            console.log('Retrieved house allowance', allowance.toString())
            this.setState({ allowance: allowance.toFixed(0) })
        } catch (err) {
            console.log('Error retrieving house allowance', err.message)
        }
    }

    /**
     * Returns DBET balance for the logged in address
     */
    initDbetBalance = async () => {
        try {
            let balance = await helper
                .getContractHelper()
                .getWrappers()
                .token()
                .balanceOf(helper.getWeb3().eth.defaultAccount)

            console.log('Retrieved DBET balance', balance.toString())
            balance = helper.formatEther(balance)
            this.setState({ balance: balance })
        } catch (err) {
            console.log('Error retrieving DBET balance', err.message)
        }
    }

    /**
     * Returns details for a session's lottery
     */
    initLottery = async session => {
        try {
            let lottery = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .lotteries(session)

            lottery = {
                ticketCount: lottery[0].toFixed(0),
                winningTicket: lottery[1].toFixed(0),
                payout: lottery[2].toFixed(0),
                claimed: lottery[3],
                finalized: lottery[4],
                tickets: {}
            }
            let lotteries = this.state.lotteries
            lotteries[session] = lottery
            this.setState({ lotteries: lotteries })
            this.initLotteryUserTickets(session, 0)
            console.log('Lottery', session, lottery)
        } catch (err) {
            console.log(
                'Error retrieving lottery details',
                session,
                err.message
            )
        }
    }

    /**
     * Returns ticket numbers for a session lottery for the user at an index.
     * @param session
     * @param index
     */
    initLotteryUserTickets = async (session, index) => {
        try {
            let ticket = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .lotteryUserTickets(
                    session,
                    helper.getWeb3().eth.defaultAccount,
                    index
                )

            let defaultAccount = helper.getWeb3().eth.defaultAccount
            let lotteries = this.state.lotteries
            let lottery = lotteries[session]
            if (
                !lottery.tickets.hasOwnProperty(defaultAccount) ||
                index === 0
            ) {
                lottery.tickets[defaultAccount] = {}
            }
            lottery.tickets[defaultAccount][ticket.toFixed(0)] = true
            this.setState({ lotteries: lotteries })
            this.initLotteryUserTickets(session, index + 1)
        } catch (err) {
            console.log(
                'Error retrieving lottery user tickets',
                session,
                index,
                err.message,
                JSON.stringify(
                    this.state.lotteries[session].tickets[
                        helper.getWeb3().eth.defaultAccount
                    ]
                )
            )
        }
    }

    /**
     * Get the current session's ID, or 0 if it isn't started yet
     */
    currentSessionID = () =>
        this.state.currentSession === 0 ? 1 : this.state.currentSession

    /**
     * Initialize all the data for the session
     * @param session session ID to initialize
     */
    initSessionData = session => {
        this.getUserCreditsForSession(session)
        this.initHouseFunds(session)
        this.initSessionDetails(session)
        this.initLottery(session)
    }

    /**
     * Purchase session credits. Amount must be converted to 18 decimal places before buying.
     * @param amount
     */
    purchaseCredits = async amount => {
        console.log('Purchasing credits', amount)

        try {
            let tx = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .purchaseCredits(amount)
            console.log(
                'Successfully sent purchase credits tx',
                JSON.stringify(tx)
            )
        } catch (err) {
            console.log('Error sending purchase credits tx', err.message)
        }
    }

    /**
     * Approves the house contract to withdraw 'amount' DBETs from the user's ETH address and
     * purchases 'amount' credits
     * @param amount
     */
    approveAndPurchaseCredits = async amount => {
        let house = helper.getContractHelper().getHouseInstance().address

        try {
            let tx = await helper
                .getContractHelper()
                .getWrappers()
                .token()
                .approve(house, amount)
            console.log('Successfully sent approve tx', tx)
            this.purchaseCredits(amount)
        } catch (err) {
            console.log('Error sending approve tx', err)
        }
    }

    /**
     * Executes confirmed Credit purchase
     * @param {BigNumber} amount How Much?
     */
    onCreditPurchaseListener = amount => {
        let bigAmount = new BigNumber(amount)
        let ether = bigAmount.times(ethUnits.units.ether)
        let formattedAmount = ether.toFixed()
        if (ether.isLessThanOrEqualTo(this.state.allowance)) {
            this.purchaseCredits(formattedAmount)
        } else {
            this.approveAndPurchaseCredits(formattedAmount)
        }
    }

    /**
     * Listener that opens the Purchase Dialog
     */
    onOpenPurchaseDialogListener = () =>
        this.setState({ isDialogPurchaseCreditsOpen: true })

    /**
     * Listener to close the Purchase Dialog
     */
    onClosePurchaseDialogListener = () =>
        this.setState({ isDialogPurchaseCreditsOpen: false })

    renderPurchaseCreditDialog = () => (
        <PurchaseCreditsDialog
            isOpen={this.state.isDialogPurchaseCreditsOpen}
            sessionNumber={this.state.currentSession}
            onConfirmListener={this.onCreditPurchaseListener}
            allowance={this.state.allowance}
            balance={this.state.balance}
            onCloseListener={this.onClosePurchaseDialogListener}
        />
    )

    renderHeader = () => {
        let allowance = helper.formatEther(this.state.allowance)
        return (
            <Fragment>
                <header>
                    <h1 className="text-center">
                        DECENT<span className="color-gold">.BET</span> House
                    </h1>
                </header>

                <Card>
                    <CardText>{`House Allowance: ${allowance} DBETs`}</CardText>
                    <CardActions>
                        <RaisedButton
                            icon={<FontAwesomeIcon icon="money-bill-alt" />}
                            label="Purchase Credits"
                            secondary={true}
                            fullWidth={true}
                            onClick={this.onOpenPurchaseDialogListener}
                        />
                    </CardActions>
                </Card>
            </Fragment>
        )
    }

    renderHouseStats = () => {
        let currentSession = this.currentSessionID()
        let currentSessionCredits = this.state.credits[currentSession]
        let availableCredits = currentSessionCredits
            ? helper.formatEther(currentSessionCredits)
            : '0'
        return (
            <HouseStats
                currentSession={currentSession}
                authorizedAddresses={this.state.addresses.authorized}
                availableCredits={availableCredits}
            />
        )
    }

    renderLotteryDetails = () => {
        let currentSession = this.currentSessionID()
        let currentLottery = this.state.lotteries[currentSession]
        return (
            <Fragment>
                <LotteryTicketsCard lottery={currentLottery} />
                <LotteryDetails lottery={currentLottery} />
            </Fragment>
        )
    }

    renderSessionStats = () => {
        let houseFunds = this.state.houseFunds[this.currentSessionID()]
        return <SessionStats houseFunds={houseFunds} />
    }

    render() {
        return (
            <main className="house">
                <div className="container">
                    {this.renderHeader()}
                    {this.renderHouseStats()}

                    <section>
                        <h3>SESSION STATS</h3>
                    </section>
                    {this.renderSessionStats()}

                    <section>
                        <h3>LOTTERY</h3>
                    </section>
                    {this.renderLotteryDetails()}
                </div>
                {this.renderPurchaseCreditDialog()}
            </main>
        )
    }
}
