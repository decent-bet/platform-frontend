import React, { Component, Fragment } from 'react'
import ConfirmationDialog from '../../../Base/Dialogs/ConfirmationDialog'
import BetNowButton from './BetNowButton'
import DepositTokensDialog from './DepositTokensDialog'
import WithdrawTokensDialog from './WithdrawTokensDialog'
import GamesCard from './GamesCard'
import Stats from './Stats'
import PlacedBetsCard from './PlacedBetsCard'
import EventBus from 'eventing-bus'
import { Provider } from 'react-redux'
import store from '../../../Model/store'
import Helper from '../../../Helper'

// Redux Actions. TODO: cleanup
import initializationSequence from '../../../Model/store'
import {
    getTokenBalance,
    depositTokens,
    withdrawTokens,
    approveAndDepositTokens
} from '../../../Model/Sportsbook/actions/balanceActions'
import { getCurrentSessionDepositedTokens } from '../../../Model/Sportsbook/actions/basicActions'
import {
    getGameItem,
    getGameOddsCount,
    getMaxBetLimit,
    getBetLimitForPeriod,
    getGamePeriodOutcome
} from '../../../Model/Sportsbook/actions/gameActions'
import {
    getUserBets,
    claimBet,
    setBet
} from '../../../Model/Sportsbook/actions/betActions'
import { getGameItem as getOracleGameItem } from '../../../Model/Sportsbook/actions/oracleGameActions'

import './sportsbook.css'

const BigNumber = require('bignumber.js')
const ethUnits = require('ethereum-units')
const helper = new Helper()

const DIALOG_CONFIRM_BET = 0,
    DIALOG_DEPOSIT_TOKENS = 1,
    DIALOG_WITHDRAW_TOKENS = 2

export default class Sportsbook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            token: {
                balance: 0
            },
            bettingProvider: {
                address: '',
                house: '0x0',
                sportsOracle: '0x0',
                currentSession: 0,
                balance: 0,
                depositedTokens: 0,
                allowance: 0,
                gamesCount: 0,
                games: {},
                placedBets: {},
                time: null
            },
            sportsOracle: {
                owner: '',
                balance: 0,
                gamesCount: 0,
                payments: {
                    gameUpdateCost: 0,
                    providerAcceptanceCost: 0,
                    payForProviderAcceptance: false
                },
                addresses: {
                    authorizedAddresses: [],
                    requestedProviderAddresses: [],
                    acceptedProviderAddresses: []
                },
                games: {},
                time: null
            },
            leagues: {},
            periodDescriptions: {},
            odds: {},
            betAmounts: {},
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
        store.dispatch(initializationSequence())
        this.initBettingProviderData()
        this.initSportsOracleData()
        this.initTokenData()
    }

    initBettingProviderData = () => {
        /** Events */
        this.watchers()
            .bettingProvider()
            .deposit()
        this.watchers()
            .bettingProvider()
            .withdraw()
        this.watchers()
            .bettingProvider()
            .newBet()
        this.watchers()
            .bettingProvider()
            .updatedMaxBet()
        this.watchers()
            .bettingProvider()
            .claimedBet()
        this.watchers()
            .bettingProvider()
            .newGame()
        this.watchers()
            .bettingProvider()
            .newGameOdds()
        this.watchers()
            .bettingProvider()
            .updatedBetLimits()
        this.watchers()
            .bettingProvider()
            .updatedGameOdds()
        this.watchers()
            .bettingProvider()
            .updatedTime()
    }

    initSportsOracleData = () => {
        /** Events */
        this.watchers()
            .sportsOracle()
            .gameAdded()
        this.watchers()
            .sportsOracle()
            .updatedProviderOutcome()
        this.watchers()
            .sportsOracle()
            .updatedTime()
    }

    initTokenData = () => {
        this.watchers()
            .token()
            .transferFrom()
        this.watchers()
            .token()
            .transferTo()
    }

    watchers = () => {
        const self = this
        return {
            token: () => {
                return {
                    transferFrom: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .token()
                            .logTransfer(self.state.address, true)
                            .watch((err, event) => {
                                if (!err) store.dispatch(getTokenBalance())
                            })
                    },
                    transferTo: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .token()
                            .logTransfer(self.state.address, false)
                            .watch((err, event) => {
                                if (!err) store.dispatch(getTokenBalance())
                            })
                    }
                }
            },
            bettingProvider: () => {
                return {
                    deposit: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logDeposit()
                            .watch((err, event) => {
                                console.log('Deposit event', err, event)
                                const amount = event.args.amount.toString()
                                const session = event.args.session.toNumber()

                                helper.toggleSnackbar(
                                    'DBETs deposited into sportsbook contract - ' +
                                        helper.formatEther(amount) +
                                        ' DBETs'
                                )

                                store.dispatch(getTokenBalance())
                                store.dispatch(
                                    getCurrentSessionDepositedTokens(session)
                                )
                            })
                    },
                    withdraw: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logWithdraw()
                            .watch((err, event) => {
                                console.log('Withdraw event', err, event)
                                const amount = event.args.amount.toString()
                                const session = event.args.session.toNumber()

                                helper.toggleSnackbar(
                                    'DBETs withdrawn from sportsbook contract - ' +
                                        helper.formatEther(amount) +
                                        ' DBETs'
                                )

                                store.dispatch(getTokenBalance())
                                store.dispatch(
                                    getCurrentSessionDepositedTokens(session)
                                )
                            })
                    },
                    newBet: () => {
                        console.log('Watching for new bets')
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logNewBet()
                            .watch((err, event) => {
                                console.log(
                                    'New bet event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.gameId.toNumber()
                                let betId = event.args.betId.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'New bet placed for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                store.dispatch(getGameItem(gameId))
                                store.dispatch(getUserBets(betId))
                                store.dispatch(getTokenBalance)
                                store.dispatch(
                                    getCurrentSessionDepositedTokens()
                                )
                            })
                    },
                    newGame: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logNewGame()
                            .watch((err, event) => {
                                console.log(
                                    'New game event',
                                    err,
                                    JSON.stringify(event)
                                )

                                helper.toggleSnackbar(
                                    'New game available for betting'
                                )

                                let id = event.args.id.toNumber()
                                store.dispatch(getGameItem(id))
                            })
                    },
                    newGameOdds: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logNewGameOdds()
                            .watch((err, event) => {
                                console.log(
                                    'New game odds event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()
                                let oddsId = event.args.oddsId.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'New odds available for betting - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                store.dispatch(getGameOddsCount(gameId))
                            })
                    },
                    updatedGameOdds: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedGameOdds()
                            .watch((err, event) => {
                                console.log(
                                    'Updated game odds event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()
                                let oddsId = event.args.oddsId.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Odds updated for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                store.dispatch(getGameOddsCount(gameId))
                            })
                    },
                    updatedMaxBet: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedMaxBet()
                            .watch((err, event) => {
                                console.log(
                                    'Updated max bet event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Updated max bet for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                store.dispatch(getMaxBetLimit(gameId))
                            })
                    },
                    updatedBetLimits: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedBetLimits()
                            .watch((err, event) => {
                                console.log(
                                    'Updated bet limits event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.id.toNumber()
                                let period = event.args.period.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Updated bet limits for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                if (
                                    !self.state.bettingProvider.games[
                                        gameId
                                    ].betLimits.hasOwnProperty(period)
                                )
                                    store.dispatch(
                                        getBetLimitForPeriod(gameId, period)
                                    )
                            })
                    },
                    claimedBet: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logClaimedBet()
                            .watch((err, event) => {
                                console.log(
                                    'Claimed bet event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let gameId = event.args.gameId.toNumber()
                                let session = event.args.session.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, gameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, gameId)

                                helper.toggleSnackbar(
                                    'Claimed bet for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                store.dispatch(getTokenBalance())
                                store.dispatch(
                                    getCurrentSessionDepositedTokens()
                                )
                                store.dispatch(getUserBets(0))
                            })
                    },
                    updatedTime: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .bettingProvider()
                            .logUpdatedTime()
                            .watch((err, event) => {
                                console.log(
                                    'Updated provider time event',
                                    err,
                                    event
                                )
                                let time = event.args.time.toNumber()
                                self.setState({
                                    bettingProvider: Object.assign(
                                        self.state.bettingProvider,
                                        {
                                            time: time
                                        }
                                    )
                                })
                            })
                    }
                }
            },
            sportsOracle: () => {
                return {
                    gameAdded: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .logGameAdded()
                            .watch((err, event) => {
                                console.log(
                                    'Game added event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let id = event.args.id.toNumber()
                                store.dispatch(getOracleGameItem(id))
                            })
                    },
                    updatedProviderOutcome: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .logUpdatedProviderOutcome()
                            .watch((err, event) => {
                                console.log(
                                    'Updated provider outcome event',
                                    err,
                                    JSON.stringify(event)
                                )
                                let providerGameId = event.args.providerGameId.toNumber()
                                let period = event.args.period.toNumber()

                                let home = self
                                    .helpers()
                                    .getTeamName(true, providerGameId)
                                let away = self
                                    .helpers()
                                    .getTeamName(false, providerGameId)

                                helper.toggleSnackbar(
                                    'Results pushed for game - ' +
                                        home +
                                        ' vs. ' +
                                        away
                                )

                                if (
                                    !self.state.bettingProvider.games[
                                        providerGameId
                                    ].outcomes.hasOwnProperty(period)
                                )
                                    store.dispatch(
                                        getGamePeriodOutcome(
                                            providerGameId,
                                            period
                                        )
                                    )
                            })
                    },
                    updatedTime: () => {
                        helper
                            .getContractHelper()
                            .getWrappers()
                            .sportsOracle()
                            .logUpdatedTime()
                            .watch((err, event) => {
                                console.log(
                                    'Updated oracle time event',
                                    err,
                                    event
                                )
                                let time = event.args.time.toNumber()
                                self.setState({
                                    bettingProvider: Object.assign(
                                        self.state.bettingProvider,
                                        {
                                            time: time
                                        }
                                    )
                                })
                            })
                    }
                }
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            getTeamName: (isHome, gameId) => {
                let oracleGameId =
                    self.state.bettingProvider.games[gameId].oracleGameId
                return self.state.sportsOracle.games[oracleGameId]
                    ? self.state.sportsOracle.games[oracleGameId][
                          isHome ? 'team1' : 'team2'
                      ]
                    : 'Loading..'
            },
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
            },
            getOracleGame: id => {
                return self.state.sportsOracle.games[id]
            }
        }
    }

    onClaimBetListener = (gameItem, betId) =>
        store.dispatch(claimBet(gameItem.id, betId))

    onConfirmBetListener = () => {
        let selectedBet = this.state.dialogs.confirmBet.selectedBet
        let gameId = selectedBet.gameId
        let oddsObj = selectedBet.oddsObj
        store.dispatch(setBet(gameId, oddsObj))
        this.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)
    }

    onConfirmDepositListener = amount => {
        let bigAllowance = new BigNumber(amount).times(ethUnits.units.ether)
        let isAllowanceAvailable = bigAllowance.isLessThanOrEqualTo(
            this.state.bettingProvider.allowance
        )
        let formattedAmount = bigAllowance.toFixed()
        isAllowanceAvailable
            ? store.dispatch(depositTokens(formattedAmount))
            : store.dispatch(approveAndDepositTokens(formattedAmount))
    }

    onDepositTokensDialogOpen = () =>
        this.helpers().toggleDialog(DIALOG_DEPOSIT_TOKENS, true)

    onSetBetAmountListener = (gameId, oddsId, betAmount) => {
        let odds = this.state.odds
        odds[gameId][oddsId].betAmount = betAmount
        console.log('Changed betAmount', odds, gameId, oddsId)
        this.setState({ odds: odds })
    }

    onSetBetTeamListener = (gameId, oddsId, value) => {
        let odds = this.state.odds
        odds[gameId][oddsId].selectedChoice = value
        this.setState({ odds: odds })
    }

    onSetTeamTotalListener = (gameId, oddsId, value) => {
        let odds = this.state.odds
        odds[gameId][oddsId].selectedChoice = value
        this.setState({ odds: odds })
    }

    onToggleWithdrawDialog = enabled => {
        this.helpers().toggleDialog(DIALOG_WITHDRAW_TOKENS, enabled)
    }

    onToggleDepositDialogListener = enabled => {
        this.helpers().toggleDialog(DIALOG_DEPOSIT_TOKENS, enabled)
    }

    onCloseConfirmBetDialogListener = () =>
        this.helpers().toggleDialog(DIALOG_CONFIRM_BET, false)

    onOpenConfirmBetDialogListener = (gameId, oddsId) => {
        let dialogs = this.state.dialogs
        let oddsObj = this.state.odds[gameId][oddsId]

        dialogs.confirmBet.message =
            'You are now placing a bet of ' +
            oddsObj.betAmount +
            ' DBETs for ' +
            this.helpers().getTeamName(true, gameId) +
            ' vs. ' +
            this.helpers().getTeamName(false, gameId) +
            '. Please click OK to confirm your bet'

        dialogs.confirmBet.selectedBet = {
            gameId: gameId,
            oddsId: oddsId,
            oddsObj: oddsObj
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
        store.dispatch(
            withdrawTokens(
                formattedAmount,
                this.state.bettingProvider.currentSession
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
                sessionNumber={this.state.bettingProvider.currentSession}
                onConfirm={this.onConfirmDepositListener}
                allowance={this.state.bettingProvider.allowance}
                balance={this.state.token.balance}
                toggleDialog={this.onToggleDepositDialogListener}
            />
            <WithdrawTokensDialog
                open={this.state.dialogs.withdrawTokens.open}
                sessionNumber={this.state.bettingProvider.currentSession}
                onConfirm={this.onWithdrawListener}
                balance={this.state.bettingProvider.depositedTokens}
                toggleDialog={this.onToggleWithdrawDialog}
            />
        </Fragment>
    )

    renderMainContent = () => {
        // Merge the arrays into usable data
        // TODO: set this code in initialization sequence
        let { games } = this.state.bettingProvider
        let gamesMap = Object.keys(games).map(gameId => {
            let game = games[gameId]
            game.id = gameId
            game.odds = this.state.odds[game.id]
            game.oracleInfo = this.state.sportsOracle.games[game.oracleGameId]
            game.placedBets = this.state.bettingProvider.placedBets[game.id]
            return game
        })
        let parameters = {
            bettingProvider: this.state.bettingProvider,
            sportsOracle: this.state.sportsOracle,
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
        let { time, depositedTokens } = this.state.bettingProvider
        if (time != null) {
            if (gameItem.cutOffTime > time) {
                return (
                    <BetNowButton
                        oddItem={oddItem}
                        game={gameItem}
                        depositedTokens={depositedTokens}
                        bettingProviderTime={time}
                        onSetBetAmountListener={this.onSetBetAmountListener}
                        onSetBetTeamListener={this.onSetBetTeamListener}
                        onSetTeamTotalListener={this.onSetTeamTotalListener}
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
            <Provider store={store}>
                <div className="sportsbook">
                    <div className="main pb-4">
                        <div className="row">
                            <div className="col-8">
                                {this.renderMainContent()}
                            </div>
                            <div className="col-4">
                                <Stats
                                    bettingProvider={this.state.bettingProvider}
                                    onDepositTokensDialogOpen={
                                        this.onDepositTokensDialogOpen
                                    }
                                    onOpenWithdrawDialog={
                                        this.onOpenWithdrawDialog
                                    }
                                />
                            </div>
                        </div>
                        {this.renderDialogs()}
                    </div>
                </div>
            </Provider>
        )
    }
}
