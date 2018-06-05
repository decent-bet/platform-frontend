/**
 * Created by user on 8/21/2017.
 */

import React, { Component, Fragment } from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Button, Card, CardContent, CardActions } from '@material-ui/core'
import PurchaseCreditsDialog from './Dialogs/PurchaseCreditsDialog'
import Helper from '../../Helper'
import HouseStats from './HouseStats'
import LotteryDetails from './LotteryDetails'
import LotteryTicketsCard from './LotteryTicketsCard'
import SessionStats from './SessionStats'
import { BigNumber } from 'bignumber.js'
import ethUnits from 'ethereum-units'
import { connect } from 'react-redux'
import { Actions, initWatchers, stopWatchers } from '../../../Model/house'

import './house.css'

const helper = new Helper()

class House extends Component {
    state = {
        isDialogPurchaseCreditsOpen: false
    }

    componentDidMount = () => {
        this.props.dispatch(Actions.getHouseSessionId())
        this.props.dispatch(Actions.getHouseSessionData())
        this.props.dispatch(Actions.getHouseAuthorizedAddresses())
        this.props.dispatch(Actions.getHouseAllowance())

        this.props.dispatch(initWatchers)
    }

    componentWillUnmount = () => {
        this.props.dispatch(stopWatchers)
    }

    /**
     * Executes confirmed Credit purchase
     * @param {BigNumber} amount How Much?
     */
    onCreditPurchaseListener = amount => {
        let bigAmount = new BigNumber(amount)
        let ether = bigAmount.times(ethUnits.units.ether)
        let formattedAmount = ether.toFixed()

        // Setup action
        let action = ether.isLessThanOrEqualTo(this.props.house.allowance)
            ? Actions.purchaseHouseCredits(formattedAmount)
            : Actions.approveAndPurchaseHouseCredits(formattedAmount)
        this.props.dispatch(action)
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
            sessionNumber={this.props.house.sessionId}
            onConfirmListener={this.onCreditPurchaseListener}
            allowance={this.props.house.allowance}
            balance={this.props.balance.balance}
            onCloseListener={this.onClosePurchaseDialogListener}
        />
    )

    renderHeader = () => {
        let allowance = helper.formatEther(this.props.house.allowance)
        return (
            <Fragment>
                <header>
                    <h1 className="text-center">
                        DECENT<span className="color-gold">.BET</span> House
                    </h1>
                </header>

                <Card>
                    <CardContent
                    >{`House Allowance: ${allowance} DBETs`}</CardContent>
                    <CardActions>
                        <Button
                            variant="raised"
                            icon={<FontAwesomeIcon icon="money-bill-alt" />}
                            secondary={true}
                            fullWidth={true}
                            onClick={this.onOpenPurchaseDialogListener}
                        >
                            Purchase Credits
                        </Button>
                    </CardActions>
                </Card>
            </Fragment>
        )
    }

    renderHouseStats = () => {
        let currentSession = this.props.house.sessionId
        let adjustedCurrentSession = currentSession === '0' ? 1 : currentSession
        let currentSessionCredits = this.props.house.sessionState.hasOwnProperty(
            adjustedCurrentSession
        )
            ? this.props.house.sessionState[adjustedCurrentSession].credits
            : 0
        let availableCredits = currentSessionCredits
            ? helper.formatEther(currentSessionCredits)
            : '0'
        return (
            <HouseStats
                currentSession={currentSession}
                authorizedAddresses={this.props.house.authorizedAddresses}
                availableCredits={availableCredits}
            />
        )
    }

    renderLotteryDetails = () => {
        let currentSession = this.props.house.sessionId
        let adjustedCurrentSession = currentSession === '0' ? 1 : currentSession
        let currentSessionState = this.props.house.sessionState[
            adjustedCurrentSession
        ]
        if (currentSessionState) {
            let currentLottery = currentSessionState.lottery
            console.log('currentLottery', currentLottery)
            return (
                <Fragment>
                    <LotteryTicketsCard lottery={currentLottery} />
                    <LotteryDetails lottery={currentLottery} />
                </Fragment>
            )
        } else {
            return null
        }
    }

    renderSessionStats = () => {
        let currentSession = this.props.house.sessionId
        let adjustedCurrentSession = currentSession === '0' ? 1 : currentSession
        let currentSessionState = this.props.house.sessionState[
            adjustedCurrentSession
        ]
        if (currentSessionState) {
            let houseFunds = currentSessionState.houseFunds
            return <SessionStats houseFunds={houseFunds} />
        } else {
            return null
        }
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

export default connect(state => state)(House)
