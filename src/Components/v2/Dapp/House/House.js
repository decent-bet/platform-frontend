/**
 * Created by user on 8/21/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import PurchaseCreditsDialog from './Dialogs/PurchaseCreditsDialog'

import Helper from '../../Helper'

const helper = new Helper()

const BigNumber = require('bignumber.js')
const constants = require('./../../Constants')
const ethUnits = require('ethereum-units')

const DIALOG_PURCHASE_CREDITS = 0

const styles = require('../../Base/styles').styles()

import './house.css'

class House extends Component {

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
            dialogs: {
                purchaseCredits: {
                    open: false
                }
            }
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    initData = () => {
        this.web3Getters().currentSession()
        this.web3Getters().authorizedAddresses(0, true)
        this.web3Getters().houseAllowance()
        this.web3Getters().dbetBalance()
    }

    initWatchers = () => {
        this.watchers().transferFrom()
        this.watchers().transferTo()
    }

    watchers = () => {
        const self = this
        return {
            purchasedCredits: (sessionNumber) => {
                let purchasedCreditsEvent = helper.getContractHelper().getWrappers().house()
                    .logPurchasedCredits(sessionNumber, 'latest')
                purchasedCreditsEvent.watch((err, event) => {
                    if (err)
                        console.log('Purchased credits event error: ' + err)
                    else {
                        let balance = event.args.balance
                        let credits = self.state.credits
                        credits[sessionNumber] = balance.toFixed(0)
                        self.setState({
                            credits: credits
                        })
                        self.helpers().initSessionData(self.helpers().getCurrentSession())
                        console.log('Purchased credits event: ', event)
                    }
                })
            },
            liquidateCredits: (sessionNumber) => {
                let liquidateCreditsEvent = helper.getContractHelper().getWrappers().house()
                    .logLiquidateCredits(sessionNumber)
                liquidateCreditsEvent.watch((err, event) => {
                    if (err)
                        console.log('Liquidate credits event error: ' + err)
                    else {
                        let creditHolder = event.args.creditHolder
                        let session = event.args.session
                        let amount = event.args.amount
                        let payout = event.args.payout
                        let balance = event.args.balance

                        let credits = self.state.credits
                        credits[sessionNumber] = balance.toFixed(0)
                        self.setState({
                            credits: credits
                        })
                        console.log('Liquidate credits event: ', event)
                    }
                })
            },
            transferFrom: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, true).watch((err, event) => {
                    console.log('transferFrom', err, JSON.stringify(event))
                    if (!err) {
                        self.web3Getters().dbetBalance()
                    }
                })
            },
            transferTo: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, false).watch((err, event) => {
                    console.log('transferTo', err, JSON.stringify(event))
                    if (!err) {
                        self.web3Getters().dbetBalance()
                    }
                })
            }
        }
    }

    web3Getters = () => {
        const self = this
        return {
            /**
             * Returns the current session in the house contract.
             */
            currentSession: () => {
                helper.getContractHelper().getWrappers().house().getCurrentSession().then((session) => {
                    session = session.toFixed(0)
                    self.setState({
                        currentSession: session
                    })
                    self.helpers().initSessionData(self.helpers().getCurrentSession())
                    self.watchers().purchasedCredits(self.helpers().getCurrentSession())
                }).catch((err) => {
                    console.log('Error retrieving current session')
                })
            },
            /**
             * Iterates over authorized addresses available in the house contract.
             * @param index
             * @param iterate
             */
            authorizedAddresses: (index, iterate) => {
                helper.getContractHelper().getWrappers().house().getAuthorizedAddresses(index).then((address) => {
                    if (address !== '0x') {
                        let addresses = self.state.addresses
                        addresses.authorized.push(address)
                        self.setState({
                            addresses: addresses
                        })
                        if (iterate)
                            self.web3Getters().authorizedAddresses(index + 1, true)
                    }
                }).catch((err) => {
                    console.log('Error retrieving authorized address', index, iterate)
                })
            },
            /**
             * Retrieves the users credits for a session
             * @param sessionNumber
             */
            getUserCreditsForSession: (sessionNumber) => {
                helper.getContractHelper().getWrappers().house().getUserCreditsForSession(sessionNumber,
                    helper.getWeb3().eth.defaultAccount).then((userCredits) => {
                    // 0 - Amount, 1 - Liquidated, 2 - Rolled over, 3 - Exists
                    console.log('getUserCreditsForSession', userCredits[0].toFixed(0))
                    let credits = self.state.credits
                    credits[sessionNumber] = userCredits[0].toFixed(0)
                    self.setState({
                        credits: credits
                    })
                }).catch((err) => {
                    console.log('Error retrieving user credits for session', sessionNumber)
                })
            },
            /**
             * Retrieve session details - Start time, end time and isActive
             * @param sessionNumber
             */
            session: (sessionNumber) => {
                helper.getContractHelper().getWrappers().house().getSession(sessionNumber).then((session) => {
                    let sessions = self.state.sessions

                    let _session = {}
                    _session.startTime = session[0].toFixed(0)
                    _session.endTime = session[1].toFixed(0)
                    _session.active = session[2]
                    sessions[sessionNumber] = _session

                    self.setState({
                        sessions: sessions
                    })
                }).catch((err) => {
                    console.log('Error retrieving session details', sessionNumber)
                })
            },
            /**
             * Retrieve house fund details for a session - Total funds, purchased user credits, user credits
             * available, house payouts, withdrawn and profit
             * @param sessionNumber
             */
            houseFunds: (sessionNumber) => {
                helper.getContractHelper().getWrappers().house().getHouseFunds(sessionNumber).then((houseFunds) => {
                    houseFunds = {
                        totalFunds: houseFunds[0].toFixed(0),
                        totalPurchasedUserCredits: houseFunds[1].toFixed(0),
                        totalUserCredits: houseFunds[2].toFixed(0),
                        totalHousePayouts: houseFunds[3].toFixed(0),
                        totalWithdrawn: houseFunds[4].toFixed(0),
                        profit: houseFunds[5].toFixed(0)
                    }
                    let _houseFunds = self.state.houseFunds
                    _houseFunds[sessionNumber] = houseFunds
                    console.log('houseFunds', JSON.stringify(_houseFunds))
                    self.setState({
                        houseFunds: _houseFunds
                    })
                }).catch((err) => {
                    console.log('Error retrieving house funds', sessionNumber, err)
                })
            },
            /**
             * Returns the allowance assigned to the house for DBETs assigned to the user's ETH address
             */
            houseAllowance: () => {
                helper.getContractHelper().getWrappers().token().allowance(helper.getWeb3().eth.defaultAccount,
                    helper.getContractHelper().getHouseInstance().address).then((allowance) => {
                    console.log('Retrieved house allowance', allowance.toString())
                    self.setState({
                        allowance: allowance.toFixed(0)
                    })
                }).catch((err) => {
                    console.log('Error retrieving house allowance', err.message)
                })
            },
            /**
             * Returns DBET balance for the logged in address
             */
            dbetBalance: () => {
                helper.getContractHelper().getWrappers().token()
                    .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                    console.log('Retrieved DBET balance', balance.toString())
                    balance = helper.formatEther(balance)
                    self.setState({
                        balance: balance
                    })
                }).catch((err) => {
                    console.log('Error retrieving DBET balance', err.message)
                })
            },
            /**
             * Returns details for a session's lottery
             */
            lottery: (session) => {
                helper.getContractHelper().getWrappers().house().lotteries(session).then((lottery) => {
                    lottery = {
                        ticketCount: lottery[0].toFixed(0),
                        winningTicket: lottery[1].toFixed(0),
                        payout: lottery[2].toFixed(0),
                        claimed: lottery[3],
                        finalized: lottery[4],
                        tickets: {}
                    }
                    let lotteries = self.state.lotteries
                    lotteries[session] = lottery
                    self.setState({
                        lotteries: lotteries
                    })
                    self.web3Getters().lotteryUserTickets(session, 0)
                    console.log('Lottery', session, lottery)
                }).catch((err) => {
                    console.log('Error retrieving lottery details', session, err.message)
                })
            },
            /**
             * Returns ticket numbers for a session lottery for the user at an index.
             * @param session
             * @param index
             */
            lotteryUserTickets: (session, index) => {
                helper.getContractHelper().getWrappers().house().lotteryUserTickets(session,
                    helper.getWeb3().eth.defaultAccount, index).then((ticket) => {
                    let lotteries = self.state.lotteries
                    let lottery = lotteries[session]
                    if (!lottery.tickets.hasOwnProperty(helper.getWeb3().eth.defaultAccount) || index == 0)
                        lottery.tickets[helper.getWeb3().eth.defaultAccount] = {}
                    lottery.tickets[helper.getWeb3().eth.defaultAccount][ticket.toFixed(0)] = true
                    self.setState({
                        lotteries: lotteries
                    })
                    self.web3Getters().lotteryUserTickets(session, index + 1)
                }).catch((err) => {
                    console.log('Error retrieving lottery user tickets', session, index, err.message,
                        JSON.stringify(self.state.lotteries[session].tickets[helper.getWeb3().eth.defaultAccount]))
                })
            },
            /**
             * Returns the ticket holder for a ticket number.
             */
            lotteryTicketHolder: (session, ticketNumber) => {
                helper.getContractHelper().getWrappers().house().lotteryTicketHolder(session,
                    ticketNumber).then((tickets) => {

                }).catch((err) => {
                    console.log('Error retrieving lottery ticket holder', session, ticketNumber, err.message)
                })
            },
        }
    }

    helpers = () => {
        const self = this
        return {
            getCurrentSession: () => {
                return self.state.currentSession == 0 ? 1 : self.state.currentSession
            },
            getCurrentSessionHouseFunds: () => {
                return self.state.houseFunds[self.helpers().getCurrentSession()]
            },
            toggleDialog: (dialog, open) => {
                let dialogs = self.state.dialogs
                if (dialog == DIALOG_PURCHASE_CREDITS)
                    dialogs.purchaseCredits.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            initSessionData: (session) => {
                self.web3Getters().getUserCreditsForSession(session)
                self.web3Getters().houseFunds(session)
                self.web3Getters().session(session)
                self.web3Getters().lottery(session)
            },
            getCurrentSessionLottery: () => {
                let session = self.helpers().getCurrentSession()
                return {
                    userTickets: () => {
                        return self.state.lotteries[session] ?
                            Object.keys(self.state.lotteries[session].tickets[helper.getWeb3().eth.defaultAccount]) :
                            null
                    },
                    details: () => {
                        return self.state.lotteries[session]
                    }
                }
            }
        }
    }

    views = () => {
        const self = this
        return {
            header: () => {
                return <div className="row">
                    <div className="col-12">
                        <h1 className="text-center">DECENT<span className="color-gold">.BET</span> HOUSE
                        </h1>
                    </div>
                    <div className="col-12">
                        <RaisedButton
                            label={<span className="fa fa-money text-white">
                                <span style={styles.buttonLabel }> Purchase Credits</span>
                            </span>}
                            className="float-right"
                            backgroundColor={constants.COLOR_ACCENT_DARK}
                            onClick={() => {
                                self.helpers().toggleDialog(DIALOG_PURCHASE_CREDITS, true)
                            }}
                        />
                    </div>
                    <div className="col-12">
                        <small className="text-white float-right mt-2">
                            HOUSE ALLOWANCE: {helper.formatEther(self.state.allowance)} DBETs
                        </small>
                    </div>
                </div>
            },
            houseStats: () => {
                return <div className="row stats">
                    <div className="col-4 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h4 className="header">CURRENT SESSION</h4>
                                        <h4 className="stat mt-3">{ self.state.currentSession }</h4>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-4 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h4 className="header mb-2">AUTHORIZED ADDRESSES</h4>
                                        {   self.state.addresses.authorized.length > 0 &&
                                        self.state.addresses.authorized.map((address) =>
                                            <p className="stat mt-3 address">{ address }</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-4 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h4 className="header">CREDITS AVAILABLE</h4>
                                        <h4 className="stat mt-3">
                                            { self.state.credits.hasOwnProperty(self.helpers().getCurrentSession()) ?
                                                helper.formatEther
                                                (self.state.credits[self.helpers().getCurrentSession()]) : '0' } CREDITS
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            },
            sessionStats: () => {
                return <div className="row stats">
                    <div className="col-4 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h4 className="header mb-2">TOTAL HOUSE FUNDS</h4>
                                        <h4 className="stat mt-3">
                                            { self.helpers().getCurrentSessionHouseFunds() ?
                                                helper.formatEther(self.helpers().getCurrentSessionHouseFunds()
                                                    .totalFunds) : '0'} DBETS
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-4 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h4 className="header mb-2">TOTAL HOUSE CREDITS</h4>
                                        <h4 className="stat mt-3">
                                            { self.helpers().getCurrentSessionHouseFunds() ?
                                                helper.formatEther(self.helpers().getCurrentSessionHouseFunds()
                                                    .totalUserCredits) : '0'} CREDITS
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-4 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h4 className="header mb-2">PROFIT GENERATED</h4>
                                        <h4 className="stat mt-3">
                                            { self.helpers().getCurrentSessionHouseFunds() ?
                                                helper.formatEther(self.helpers().getCurrentSessionHouseFunds().profit)
                                                : '0'} DBETS
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            },
            lotteryInfo: () => {
                return <div className="row lottery">
                    <div className="col-6 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h4 className="header mb-2">YOUR TICKETS</h4>
                                        {   self.state.lotteries[self.state.currentSession == 0 ? 1 : self.state.currentSession] &&
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Ticket Number</th>
                                            </tr>
                                            </thead>
                                            {   self.state.lotteries[self.helpers().getCurrentSession()] &&
                                            self.state.lotteries[self.helpers().getCurrentSession()]
                                                .tickets[helper.getWeb3().eth.defaultAccount] &&
                                            <tbody>
                                            {   self.helpers().getCurrentSessionLottery().userTickets().map((ticket, index) =>
                                                <tr>
                                                    <td>{index}</td>
                                                    <td>{ticket}</td>
                                                </tr>
                                            )}
                                            </tbody>
                                            }
                                        </table>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-6 text-center hvr-float">
                        <Card style={styles.card}
                              zDepth={4}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <h4 className="header mb-2">STATISTICS</h4>
                                    </div>
                                    {   self.helpers().getCurrentSessionLottery().details() &&
                                    <div className="col-12 mt-4 statistics">
                                        <div className="row">
                                            <div className="col-6">
                                                <span className="stat float-left">TICKETS SOLD&ensp;</span>
                                            </div>
                                            <div className="col-6">
                                                <span className="float-right text-white">
                                                    {self.helpers().getCurrentSessionLottery()
                                                        .details().ticketCount} TICKETS
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-6">
                                                <span className="stat float-left">PAYOUT&ensp;</span>
                                            </div>
                                            <div className="col-6">
                                                <span className="float-right text-white">
                                                    {self.helpers().getCurrentSessionLottery()
                                                        .details().payout} DBETS
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-6">
                                                <span className="stat float-left">WINNER ANNOUNCED&ensp;</span>
                                            </div>
                                            <div className="col-6">
                                                <span className="float-right text-white">
                                                {self.helpers().getCurrentSessionLottery().details().finalized ?
                                                    <span className="text-success">YES</span> :
                                                    <span className="text-danger">NO</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            }
        }
    }

    web3Setters = () => {
        const self = this
        return {
            /**
             * Purchase session credits. Amount must be converted to 18 decimal places before buying.
             * @param amount
             */
            purchaseCredits: (amount) => {
                console.log('Purchasing credits', amount)
                helper.getContractHelper().getWrappers().house().purchaseCredits(amount).then((tx) => {
                    console.log('Successfully sent purchase credits tx', JSON.stringify(tx))
                }).catch((err) => {
                    console.log('Error sending purchase credits tx', err.message)
                })
            },
            /**
             * Approves the house contract to withdraw 'amount' DBETs from the user's ETH address and
             * purchases 'amount' credits
             * @param amount
             */
            approveAndPurchaseCredits: (amount) => {
                let house = helper.getContractHelper().getHouseInstance().address
                helper.getContractHelper().getWrappers().token().approve(house, amount).then((tx) => {
                    console.log('Successfully sent approve tx', tx)
                    self.web3Setters().purchaseCredits(amount)
                }).catch((err) => {
                    console.log('Error sending approve tx', err)
                })
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            purchaseCredits: () => {
                return <PurchaseCreditsDialog
                    open={self.state.dialogs.purchaseCredits.open}
                    sessionNumber={self.state.currentSession}
                    onConfirm={(amount) => {
                        if (amount.length > 0) {
                            let isAllowanceAvailable = new BigNumber(amount).times(ethUnits.units.ether)
                                .lessThanOrEqualTo(self.state.allowance)
                            let formattedAmount = new BigNumber(amount).times(ethUnits.units.ether).toString()
                            if (isAllowanceAvailable)
                                self.web3Setters().purchaseCredits(formattedAmount)
                            else
                                self.web3Setters().approveAndPurchaseCredits(formattedAmount)
                        }
                    }}
                    allowance={self.state.allowance}
                    balance={self.state.balance}
                    toggleDialog={(enabled) => {
                        self.helpers().toggleDialog(DIALOG_PURCHASE_CREDITS, enabled)
                    }}
                />
            }
        }
    }

    render() {
        const self = this
        return <div className="house">
            <div className="container">
                { self.views().header() }
                { self.views().houseStats() }
                <h3 className="text-center sub-header">SESSION STATS</h3>
                { self.views().sessionStats() }
                <h3 className="text-center sub-header">LOTTERY</h3>
                { self.views().lotteryInfo() }
                { self.dialogs().purchaseCredits() }
            </div>

        </div>
    }

}

export default House