/**
 * Created by user on 8/21/2017.
 */

import React, { Component } from 'react'
import { Card, CardHeader, CardContent } from '@material-ui/core'
import Helper from '../../Helper'
import { Actions as HouseActions } from '../../../Model/house'
import { Actions as BettingActions } from '../../../Model/bettingProvider'
import { Actions as SlotActions } from '../../../Model/slotsManager'

import './balances.css'
import { connect } from 'react-redux'

const helper = new Helper()
const styles = require('../../Base/styles').styles()

class Balances extends Component {
    componentDidMount = () => {
        // Get the current session
        this.props.dispatch(HouseActions.getHouseSessionId())
        // Get the balance for the Sportsbook
        this.props.dispatch(BettingActions.getDepositedTokens())
        // Get the balance of the Slots
        this.props.dispatch(SlotActions.getBalance())
    }

    renderSlotsManager = () => {
        let { slotsManager } = this.props
        if (slotsManager && slotsManager.balance) {
            let text = `${helper.formatEther(slotsManager.balance)} DBETs`
            return (
                <Card style={styles.card}>
                    <CardHeader title="Slots" />
                    <CardContent>
                        <h4>{text}</h4>
                    </CardContent>
                </Card>
            )
        }
    }

    renderBettingProvider = () => {
        let { bettingProvider } = this.props
        if (bettingProvider && bettingProvider.depositedTokens) {
            let text = helper.formatEther(bettingProvider.depositedTokens)
            return (
                <Card style={styles.card}>
                    <CardHeader title="Sportsbook" />
                    <CardContent>
                        <h4>{text} DBETs</h4>
                    </CardContent>
                </Card>
            )
        }
    }

    renderHouse = () => {
        if (this.props.house) {
            return (
                <Card style={styles.card} className="session-container">
                    <CardHeader title="Current Session" />
                    <CardContent>
                        <h4>#{this.props.house.sessionId}</h4>
                    </CardContent>
                </Card>
            )
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

                {this.renderSlotsManager()}
                {this.renderBettingProvider()}
                {this.renderHouse()}
            </main>
        )
    }
}

export default connect(state => state)(Balances)
