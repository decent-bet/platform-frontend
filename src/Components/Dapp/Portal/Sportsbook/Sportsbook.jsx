import React, { Component, Fragment } from 'react'
import ConfirmationDialog from '../../../Base/Dialogs/ConfirmationDialog'
import BetNowButton from './BetNowButton'
import DepositTokensDialog from './DepositTokensDialog'
import WithdrawTokensDialog from './WithdrawTokensDialog'
import GamesCard from './GamesCard'
import Stats from './Stats'
import PlacedBetsCard from './PlacedBetsCard'
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'
import reduxInitializationSequence from './reduxInitializationSequence'
import { Actions as BalanceActions } from '../../../../Model/balance'
import { Actions as BettingActions } from '../../../../Model/bettingProvider'
import * as BettingProvider from '../../../../Model/bettingProvider'
import * as OracleProvider from '../../../../Model/oracle'

import './sportsbook.css'

function mapStateToProps(state, ownProps) {
    return state
}

class Sportsbook extends Component {
    state = {
        dialogDepositTokenOpen: false,
        dialogWithdrawTokenOpen: false,
        dialogConfirmBetOpen: false,
        dialogConfirmBetCache: {}
    }

    componentDidMount = () => {
        this.props.dispatch(reduxInitializationSequence)

        // Watchers
        this.props.dispatch(BettingProvider.initWatchers)
        this.props.dispatch(OracleProvider.initWatchers)
    }

    componentWillUnmount = () => {
        // watchers
        this.props.dispatch(BettingProvider.stopWatchers)
        this.props.dispatch(OracleProvider.stopWatchers)
    }

    onClaimBetListener = (gameItem, betId) =>
        this.props.dispatch(BettingActions.claimBet(gameItem.id, betId))

    onConfirmBetListener = () => {
        let cache = this.state.dialogConfirmBetCache
        let { gameItem, oddItem, betAmount, betChoice } = cache
        let action = BettingActions.setBet(
            gameItem.id,
            oddItem.id,
            oddItem.betType,
            betAmount,
            betChoice
        )
        this.props.dispatch(action)
        this.setState({ dialogConfirmBetOpen: false })
    }

    onConfirmDepositListener = amount => {
        let bigAllowance = new BigNumber(amount).times(ethUnits.units.ether)
        let isAllowanceAvailable = bigAllowance.isLessThanOrEqualTo(
            this.props.bettingProvider.allowance
        )
        let formattedAmount = bigAllowance.toFixed()
        let dispatch = this.props.dispatch
        isAllowanceAvailable
            ? dispatch(BalanceActions.depositTokens(formattedAmount))
            : dispatch(BalanceActions.approveAndDepositTokens(formattedAmount))
    }

    onDepositTokensDialogOpen = () =>
        this.setState({ dialogDepositTokenOpen: true })

    onToggleWithdrawDialog = enabled =>
        this.setState({ dialogWithdrawTokenOpen: enabled })

    onToggleDepositDialogListener = enabled =>
        this.setState({ dialogDepositTokenOpen: enabled })

    onCloseConfirmBetDialogListener = () =>
        this.setState({ dialogConfirmBetOpen: false })

    onOpenConfirmBetDialogListener = (game, oddItem, betAmount, betChoice) => {
        let parsedBetAmount = new BigNumber(betAmount).toNumber()
        let homeTeam = game.oracleInfo.team1
        let awayTeam = game.oracleInfo.team2
        let message =
            `You are now placing a bet of` +
            `${parsedBetAmount} DBETs for ${homeTeam} vs ${awayTeam}. ` +
            `Please click OK to confirm your bet`

        let dialogConfirmBetCache = {
            message,
            gameItem: game,
            oddItem: oddItem,
            betAmount: betAmount,
            betChoice: betChoice
        }
        this.setState({ dialogConfirmBetOpen: true, dialogConfirmBetCache })
    }

    onOpenWithdrawDialog = () =>
        this.setState({ dialogWithdrawTokenOpen: true })

    onWithdrawListener = amount => {
        let formattedAmount = new BigNumber(amount)
            .times(ethUnits.units.ether)
            .toFixed()
        this.props.dispatch(
            BalanceActions.withdrawTokens(
                formattedAmount,
                this.props.bettingProvider.currentSession
            )
        )
    }

    renderDialogs = () => (
        <Fragment>
            <ConfirmationDialog
                open={this.state.dialogConfirmBetOpen}
                title="Bet Confirmation"
                message={this.state.dialogConfirmBetCache.message}
                onClick={this.onConfirmBetListener}
                onClose={this.onCloseConfirmBetDialogListener}
            />
            <DepositTokensDialog
                open={this.state.dialogDepositTokenOpen}
                sessionNumber={this.props.bettingProvider.currentSession}
                onConfirm={this.onConfirmDepositListener}
                allowance={this.props.bettingProvider.allowance}
                balance={this.props.balance.balance}
                toggleDialog={this.onToggleDepositDialogListener}
            />
            <WithdrawTokensDialog
                open={this.state.dialogWithdrawTokenOpen}
                sessionNumber={this.props.bettingProvider.currentSession}
                onConfirm={this.onWithdrawListener}
                balance={this.props.bettingProvider.depositedTokens}
                toggleDialog={this.onToggleWithdrawDialog}
            />
        </Fragment>
    )

    renderMainContent = () => {
        // Merge the arrays into usable data
        // TODO: set this code in initialization sequence
        let { games } = this.props.bettingProvider
        let gamesMap = Object.keys(games).map(gameId => {
            let game = games[gameId]
            game.id = gameId
            game.placedBets = this.props.bettingProvider.placedBets[game.id]
            return game
        })
        let parameters = {
            bettingProvider: this.props.bettingProvider,
            gamesMap: gamesMap
        }
        return (
            <Fragment>
                <GamesCard
                    {...parameters}
                    betNowButtonWrapper={this.renderBetNowButton}
                />
                <PlacedBetsCard
                    {...parameters}
                    onClaimBetListener={this.onClaimBetListener}
                />
            </Fragment>
        )
    }

    /**
     * Sets up the "Bet Now" button in each "odds" row for each "game".
     *
     * @param oddItem The odds to bet on
     * @param gameItem The Game From where the odds were extracted
     */
    renderBetNowButton = (oddItem, gameItem) => {
        let { time, depositedTokens } = this.props.bettingProvider
        if (time != null) {
            if (gameItem.cutOffTime > time) {
                return (
                    <BetNowButton
                        oddItem={oddItem}
                        game={gameItem}
                        depositedTokens={depositedTokens}
                        bettingProviderTime={time}
                        onOpenConfirmBetDialogListener={
                            this.onOpenConfirmBetDialogListener
                        }
                    />
                )
            }
        }

        // Fallback. Render nothing.
        return null
    }

    render() {
        return (
            <div className="sportsbook">
                <div className="main pb-4">
                    <div className="row">
                        <div className="col-8">{this.renderMainContent()}</div>
                        <div className="col-4">
                            <Stats
                                bettingProvider={this.props.bettingProvider}
                                onDepositTokensDialogOpen={
                                    this.onDepositTokensDialogOpen
                                }
                                onOpenWithdrawDialog={this.onOpenWithdrawDialog}
                            />
                        </div>
                    </div>
                    {this.renderDialogs()}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Sportsbook)
