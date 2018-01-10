/**
 * Created by user on 8/21/2017.
 */

import React, {Component} from 'react'
import {Card, RaisedButton} from 'material-ui'

import Helper from '../../Helper'
import EventBus from 'eventing-bus'

const constants = require('./../../Constants')
const helper = new Helper()

const styles = require('../../Base/styles').styles()

import './balances.css'

class Balances extends Component {

    constructor(props) {
        super(props)
        this.state = {
            address: helper.getWeb3().eth.defaultAccount,
            bettingProvider: {
                currentSession: 0,
                balance: 0
            },
            slotsProvider: {
                currentSession: 0,
                balance: 0
            }
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        if (window.web3Loaded) {
            this.initWeb3Data()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.initWeb3Data()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initWeb3Data = () => {
        this.web3Getters().bettingProvider().currentSession()
        this.web3Getters().slotsProvider().currentSession()
    }

    web3Getters = () => {
        const self = this

        let tokenContract = helper.getContractHelper().getWrappers().token()
        let slotsContract = helper.getContractHelper().getWrappers().slotsChannelManager()
        let sportsBookContract = helper.getContractHelper().getWrappers().bettingProvider()

        return {
            bettingProvider: () => {
                return {
                    currentSession: () => {
                        sportsBookContract.getCurrentSession().then((session) => {
                            let bp = self.state.bettingProvider

                            bp.currentSession = session.toNumber()
                            self.setState({
                                bettingProvider: bp
                            })

                            /** Init data that depends on current session */
                            self.web3Getters().tokenBalance()

                        }).catch((err) => {
                            console.log('Error retrieving current session', err.message)
                        })
                    },
                    tokenBalance: () => {
                        tokenContract.balanceOf(helper.getContractHelper().getBettingProviderInstance().address)
                        .then((balance) => {
                            balance = helper.formatEther(balance.toString())

                            let bp = self.state.bettingProvider
                            
                            bp.balance = balance.toNumber()
                            self.setState({
                                bettingProvider: bp
                            })

                        }).catch((err) => {
                            console.log('Error retrieving token balance', err.message)
                        })
                    }
                }
            },
            slotsProvider: () => {
                return {
                    currentSession: () => {
                        slotsContract.currentSession().then((session) => {
                            let sp = self.state.slotsProvider
                            
                            sp.currentSession = session.toNumber()
                            self.setState({
                                slotsProvider: sp
                            })
                            /** Init data that depends on current session */
                            self.web3Getters().balanceOf()

                        }).catch((err) => {
                            console.log('Error retrieving current session', err.message)
                        })
                    },
                    balanceOf: () => {
                        slotsContract.balanceOf(self.state.address, self.state.slotsProvider.currentSession)
                        .then((balance) => {
                            let sp = self.state.slotsProvider

                            sp.balance = balance.toNumber()
                            self.setState({
                                slotsProvider: sp
                            })

                        }).catch((err) => {
                            console.log('Error retrieving balance', err.message)
                        })
                    }
                }
            }
        }
    }

    views = () => {
        const self = this
        return {
            header: () => {
                return (
                    <div className="header">
                        <h1 className="text-center">DECENT<span className="color-gold">.BET</span> BALANCES</h1>
                    </div>
                )
            },
            houseOffering: () => {
                return (
                    <div className="row stats">
                        <div className="col-4 text-center hvr-float">
                            <Card style={styles.card} zDepth={4}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <h4 className="header">SLOTS</h4>
                                            <h4 className="stat mt-3">
                                                { this.state.slotsProvider.balance }
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="col-4 text-center hvr-float">
                            <Card style={styles.card} zDepth={4}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <h4 className="header">SPORTBOOK</h4>
                                            <h4 className="stat mt-3">
                                                { this.state.bettingProvider.balance }
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                    </div>
                )
            }
        }
    }

    render() {
        const self = this
        return (
            <div className="balances">
                <div className="container">
                    { self.views().header() }
                    { self.views().houseOffering() }
                </div>
            </div>
        )
    }
}

export default Balances