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
            currentSession: 0,
            bettingProvider: {
                balance: 0
            },
            slotsChannelManager: {
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
        this.web3Getters().houseProvider().currentSession()
    }

    web3Getters = () => {
        const self = this

        let houseContract = helper.getContractHelper().getWrappers().house()
        let slotsContract = helper.getContractHelper().getWrappers().slotsChannelManager()
        let sportsBookContract = helper.getContractHelper().getWrappers().bettingProvider()

        return {
            houseProvider: () => {
                return {
                    currentSession: () => {
                        houseContract.getCurrentSession().then((session) => {
                            self.setState({
                                currentSession: session.toNumber()
                            })

                            self.web3Getters().bettingProvider().currentBalance(session)
                            self.web3Getters().slotsChannelManager().currentBalance(session)
                        })
                    }
                }
            },
            bettingProvider: () => {
                return {
                    currentBalance: (session) => {
                        sportsBookContract.balanceOf(self.state.address, session).then((balance) => {
                            let bp = self.state.bettingProvider
                            
                            bp.balance = balance.toNumber()
                            self.setState({
                                bettingProvider: bp
                            })
                        
                        }).catch((err) => {
                            console.log('Error retrieving sportsBook balance', err.message)
                        })
                    }
                }
            },
            slotsChannelManager: () => {
                return {
                    currentBalance: (session) => {
                        slotsContract.balanceOf(self.state.address, session).then((balance) => {
                            let sp = self.state.slotsChannelManager

                            sp.balance = balance.toNumber()
                            self.setState({
                                slotsChannelManager: sp
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
                    <div className="header mb-4">
                        <h1 className="text-center">DECENT<span className="color-gold">.BET</span> BALANCES</h1>
                        <p className="lead text-uppercase text-center">Balances from different house offerings</p>
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
                                                { this.state.slotsChannelManager.balance }
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