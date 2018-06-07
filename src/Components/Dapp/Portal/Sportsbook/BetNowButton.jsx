import React, { Component } from 'react'
import { MenuItem, TextField, Button, Select } from '@material-ui/core'
import BettingReturnsCalculator from '../BettingReturnsCalculator'
import Helper from '../../../Helper'

const constants = require('../../../Constants')
const bettingReturnsCalculator = new BettingReturnsCalculator()
const helper = new Helper()

export default class BetNowButton extends Component {
    constructor(props) {
        super(props)

        // Totals and Team Totals have a different default than other options
        let { oddItem } = props
        let defaultChoice =
            oddItem.betType === constants.ODDS_TYPE_TOTALS ||
            oddItem.betType === constants.ODDS_TYPE_TEAM_TOTALS
                ? constants.BET_CHOICE_OVER
                : constants.BET_CHOICE_TEAM1

        this.state = {
            currentAmount: '',
            currentChoice: defaultChoice
        }
    }

    getMaxWin = () => {
        return bettingReturnsCalculator.getMaxReturns(
            this.props.oddItem,
            this.state.currentChoice,
            this.state.currentAmount
        )
    }
    onChangeAmountListener = (event, value) =>
        this.setState({ currentAmount: value })

    onChangeTeamListener = (event, _index, value) =>
        this.setState({ currentChoice: value })

    onChangeTeamTotalListener = (event, index, value) =>
        this.setState({ currentChoice: value })

    onSubmitListener = () => {
        let { game, oddItem, onOpenConfirmBetDialogListener } = this.props
        let { currentAmount, currentChoice } = this.state
        onOpenConfirmBetDialogListener(
            game,
            oddItem,
            currentAmount,
            currentChoice
        )
    }

    isDisabled = () => {
        let time = this.props.bettingProviderTime
        let game = this.props.game
        return time != null && game.cutOffTime <= time
    }

    isSubmitDisabled = () => {
        let { game, oddItem, depositedTokens } = this.props
        let isBetEmpty = !this.state.currentAmount

        // Add the total amount in the game,
        // the total amount already betted, and the amount the user wants to bet
        let totalBetAmount =
            parseInt(oddItem.betAmount, 10) +
            parseInt(this.state.currentAmount, 10) +
            parseInt(game.betAmount, 10)
        let maxBetLimit = parseInt(game.maxBetLimit, 10)

        let betType = oddItem.betType
        let betLimits = game.betLimits[oddItem.period]
        let limit
        if (betLimits) {
            if (betType === constants.ODDS_TYPE_SPREAD) {
                limit = betLimits.spread
            } else if (betType === constants.ODDS_TYPE_MONEYLINE) {
                limit = betLimits.moneyline
            } else if (betType === constants.ODDS_TYPE_TOTALS) {
                limit = betLimits.totals
            } else if (betType === constants.ODDS_TYPE_TEAM_TOTALS) {
                limit = betLimits.teamTotals
            }
        }

        return (
            game.cutOffTime <= helper.getTimestamp() ||
            isBetEmpty ||
            totalBetAmount > maxBetLimit ||
            totalBetAmount > limit ||
            !depositedTokens ||
            depositedTokens === 0
        )
    }

    renderDropDown = () => {
        let { oddItem, game } = this.props
        let options = []

        if (
            oddItem.betType === constants.ODDS_TYPE_SPREAD ||
            oddItem.betType === constants.ODDS_TYPE_MONEYLINE
        ) {
            options.push(
                <MenuItem
                    key={constants.BET_CHOICE_TEAM1}
                    value={constants.BET_CHOICE_TEAM1}
                    primaryText={game.oracleInfo.team1}
                />
            )
            options.push(
                <MenuItem
                    key={constants.BET_CHOICE_TEAM2}
                    value={constants.BET_CHOICE_TEAM2}
                    primaryText={game.oracleInfo.team2}
                />
            )
            if (oddItem.betType === constants.ODDS_TYPE_MONEYLINE) {
                options.push(
                    <MenuItem
                        key={constants.BET_CHOICE_DRAW}
                        value={constants.BET_CHOICE_DRAW}
                        primaryText="Draw"
                    />
                )
            }
        } else {
            options.push(
                <MenuItem
                    key={constants.BET_CHOICE_OVER}
                    value={constants.BET_CHOICE_OVER}
                    primaryText="Over"
                />
            )
            options.push(
                <MenuItem
                    key={constants.BET_CHOICE_UNDER}
                    value={constants.BET_CHOICE_UNDER}
                    primaryText="Under"
                />
            )
        }

        return (
            <Select
                className="mx-auto mt-3"
                autoWidth={false}
                style={{ width: '100%' }}
                value={this.state.currentChoice}
                onChange={this.onChangeTeamListener}
            >
                {options}
            </Select>
        )
    }

    render() {
        return (
            <div className="row mt-2">
                <div className="col-4">
                    <TextField
                        floatingLabelText="Bet Amount"
                        fullWidth={true}
                        type="number"
                        disabled={this.isDisabled()}
                        value={this.currentAmount}
                        onChange={this.onChangeAmountListener}
                    />
                </div>
                <div className="col-4">{this.renderDropDown()}</div>
                <div className="col-4 pt-1">
                    <p className="text-center key">Max Win</p>
                    <p className="text-center">{this.getMaxWin()} DBETs</p>
                </div>
                <div className="col-12">
                    <Button
                        variant="raised"
                        color="secondary"
                        fullWidth={true}
                        disabled={this.isSubmitDisabled()}
                        onClick={this.onSubmitListener}
                    >
                        Bet Now
                    </Button>
                </div>
            </div>
        )
    }
}
