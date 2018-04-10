/**
 * Created by user on 8/21/2017.
 */

import React, { Component, Fragment } from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { RaisedButton, Card, CardText, CardActions } from 'material-ui'
import PurchaseCreditsDialog from './Dialogs/PurchaseCreditsDialog'
import Helper from '../../Helper'
import HouseStats from './HouseStats'
import LotteryDetails from './LotteryDetails'
import LotteryTicketsCard from './LotteryTicketsCard'
import SessionStats from './SessionStats'
import { BigNumber } from 'bignumber.js'
import ethUnits from 'ethereum-units'
import { connect } from 'react-redux'
import HouseActions from '../../../Model/actions/houseActions'
import HouseWatchers from '../../../Model/watchers/houseWatchers'

import './house.css'

const helper = new Helper()

class House extends Component {
    state = {
        isDialogPurchaseCreditsOpen: false
    }

    componentDidMount = () => {
        this.props.dispatch(HouseActions.getHouseSessionId())
        this.props.dispatch(HouseActions.getHouseSessionData())
        this.props.dispatch(HouseActions.getHouseAuthorizedAddresses())
        this.props.dispatch(HouseActions.getHouseAllowance())

        this.props.dispatch(HouseWatchers.init)
    }

    componentWillUnmount = () => {
        this.props.dispatch(HouseWatchers.stop)
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
            ? HouseActions.purchaseHouseCredits(formattedAmount)
            : HouseActions.approveAndPurchaseHouseCredits(formattedAmount)
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
            balance={this.props.token.balance}
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
        let currentSession = this.props.house.sessionId
        let currentSessionCredits = this.props.house.credits[currentSession]
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
        let currentSessionState = this.props.house.sessionState[currentSession]
        if (currentSessionState) {
            let currentLottery = currentSessionState.lottery
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
        let currentSessionState = this.props.house.sessionState[currentSession]
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

function mapStateToProps(state) {
    return state
}

export default connect(mapStateToProps)(House)
