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
import BalanceActions from '../../../../Model/actions/balanceActions'
import BetActions from '../../../../Model/actions/betActions'

import './sportsbook.css'

const DIALOG_CONFIRM_BET = 0,
    DIALOG_DEPOSIT_TOKENS = 1,
    DIALOG_WITHDRAW_TOKENS = 2

function mapStateToProps(state, ownProps) {
    return state
}

class Sportsbook extends Component {
    state = {
        dialogs: {
            confirmBet: {
                open: false,
                title: 'Place bet',
                message: '',
                selectedBet: {
                    gameId: 0,
                    oddsId: 0
                }
            },
            depositTokens: {
                open: false
            },
            withdrawTokens: {
                open: false
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            toggleDialog: (type, enabled) => {
                let dialogs = self.state.dialogs
                switch (type) {
                    case DIALOG_CONFIRM_BET:
                        dialogs.confirmBet.open = enabled
                        break
                    case DIALOG_DEPOSIT_TOKENS:
                        dialogs.depositTokens.open = enabled
                        break
                    case DIALOG_WITHDRAW_TOKENS:
                        dialogs.withdrawTokens.open = enabled
                        break
                    default:
                        // Should never happen. Do nothing.
                        break
                }
                self.setState({ dialogs: dialogs })
            }
        }
    }

    onClaimBetListener = (gameItem, betId) =>
        this.props.dispatch(BetActions.claimBet(gameItem.id, betId))

    onConfirmBetListener = () => {
        let selectedBet = this.state.dialogs.confirmBet.selectedBet
        let { gameItem, oddItem, betAmount, betChoice } = selectedBet
        this.props.dispatch(
            BetActions.setBet(
                gameItem.id,
                oddItem.id,
                oddItem.betType,
                betAmount,
                betChoice
            )
        )
        this.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)
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
        this.helpers().toggleDialog(DIALOG_DEPOSIT_TOKENS, true)

    onToggleWithdrawDialog = enabled => {
        this.helpers().toggleDialog(DIALOG_WITHDRAW_TOKENS, enabled)
    }

    onToggleDepositDialogListener = enabled => {
        this.helpers().toggleDialog(DIALOG_DEPOSIT_TOKENS, enabled)
    }

    onCloseConfirmBetDialogListener = () =>
        this.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)

    onOpenConfirmBetDialogListener = (game, oddItem, betAmount, betChoice) => {
        let dialogs = this.state.dialogs

        let parsedBetAmount = new BigNumber(betAmount).toNumber()
        let homeTeam = game.oracleInfo.team1
        let awayTeam = game.oracleInfo.team2
        dialogs.confirmBet.message =
            `You are now placing a bet of` +
            `${parsedBetAmount} DBETs for ${homeTeam} vs ${awayTeam}. ` +
            `Please click OK to confirm your bet`

        dialogs.confirmBet.selectedBet = {
            gameItem: game,
            oddItem: oddItem,
            betAmount: betAmount,
            betChoice: betChoice
        }
        dialogs.confirmBet.open = true
        this.setState({ dialogs: dialogs })
    }

    onOpenWithdrawDialog = () =>
        this.helpers().toggleDialog(DIALOG_WITHDRAW_TOKENS, true)

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
                open={this.state.dialogs.confirmBet.open}
                title={this.state.dialogs.confirmBet.title}
                message={this.state.dialogs.confirmBet.message}
                onClick={this.onConfirmBetListener}
                onClose={this.onCloseConfirmBetDialogListener}
            />
            <DepositTokensDialog
                open={this.state.dialogs.depositTokens.open}
                sessionNumber={this.props.bettingProvider.currentSession}
                onConfirm={this.onConfirmDepositListener}
                allowance={this.props.bettingProvider.allowance}
                balance={this.props.token.balance}
                toggleDialog={this.onToggleDepositDialogListener}
            />
            <WithdrawTokensDialog
                open={this.state.dialogs.withdrawTokens.open}
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
