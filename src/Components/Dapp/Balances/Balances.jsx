/**
 * Created by user on 8/21/2017.
 */

import React, { Component } from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import Helper from '../../Helper'
import EventBus from 'eventing-bus'
import './balances.css'

const helper = new Helper()

const styles = require('../../Base/styles').styles()

export default class Balances extends Component {
    constructor(props) {
        super(props)
        this.state = {
            address: helper.getWeb3().eth.defaultAccount,
            currentSession: 0,
            bettingProviderBalance: 0,
            slotsChannelManagerBalance: 0
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
        this.initHouseProvider()
    }

    // Get the session for the other providers
    initHouseProvider = async () => {
        let houseContract = helper
            .getContractHelper()
            .getWrappers()
            .house()

        // Get the current session
        let session = await houseContract.getCurrentSession()

        this.setState({ currentSession: session.toNumber() })
        this.initBettingProvider(session)
        this.initSlotChannelManager(session)
    }

    // Get the balance for the Sportsbook
    initBettingProvider = async session => {
        let sportsBookContract = helper
            .getContractHelper()
            .getWrappers()
            .bettingProvider()

        try {
            let balance = await sportsBookContract.balanceOf(
                this.state.address,
                session
            )
            this.setState({ bettingProviderBalance: balance.toNumber() })
        } catch (err) {
            console.log('Error retrieving sportsBook balance', err.message)
        }
    }

    // Get the balance of the Slots
    initSlotChannelManager = async session => {
        let slotsContract = helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()

        try {
            let balance = await slotsContract.balanceOf(
                this.state.address,
                session
            )
            this.setState({ slotsChannelManager: balance.toNumber() })
        } catch (err) {
            console.log('Error retrieving balance', err.message)
        }
    }

    render() {
        return (
            <main className="balances container">
                <header>
                    <h1 className="text-center">
                        DECENT<span className="color-gold">.BET</span> Balances
                    </h1>
                    <p className="lead text-center">
                        Balances from available house offerings
                    </p>
                </header>

                <Card style={styles.card} zDepth={4} className="hvr-float">
                    <CardHeader title="Slots" />
                    <CardText>
                        <h4>
                            {helper.formatEther(
                                this.state.slotsChannelManagerBalance
                            )}{' '}
                            DBETs
                        </h4>
                    </CardText>
                </Card>

                <Card style={styles.card} zDepth={4} className="hvr-float">
                    <CardHeader title="Sportsbook" />
                    <CardText>
                        <h4>
                            {helper.formatEther(
                                this.state.bettingProviderBalance
                            )}{' '}
                            DBETs
                        </h4>
                    </CardText>
                </Card>

                <Card
                    style={styles.card}
                    zDepth={4}
                    className="session-container hvr-float"
                >
                    <CardHeader title="Current Session" />
                    <CardText>
                        <h4>#{this.state.currentSession}</h4>
                    </CardText>
                </Card>
            </main>
        )
    }
}
