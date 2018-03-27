import React, { Component } from 'react'
import { DropDownMenu, MenuItem, TextField, RaisedButton } from 'material-ui'
import BettingReturnsCalculator from '../BettingReturnsCalculator'
import Helper from '../../../Helper'

const constants = require('../../../Constants')
const bettingReturnsCalculator = new BettingReturnsCalculator()
const helper = new Helper()

export default class BetNowButton extends Component {
    getMaxWin = () => {
        let { oddItem } = this.props
        return bettingReturnsCalculator.getMaxReturns(
            oddItem,
            oddItem.selectedChoice,
            oddItem.betAmount
        )
    }
    onChangeListener = (event, value) => {
        let { game, oddItem, onSetBetAmountListener } = this.props
        onSetBetAmountListener(game.id, oddItem.id, value)
    }

    onChangeTeamListener = (event, _index, value) => {
        let { game, oddItem, onSetBetTeamListener } = this.props
        onSetBetTeamListener(game.id, oddItem.id, value)
    }

    onChangeTeamTotalListener = (event, index, value) => {
        let { game, oddItem, onSetTeamTotalListener } = this.props
        onSetTeamTotalListener(game.id, oddItem.id, value)
    }

    onSubmitListener = () => {
        let { game, oddItem, onOpenConfirmBetDialogListener } = this.props
        onOpenConfirmBetDialogListener(game.id, oddItem.id)
    }

    isDisabled = () => {
        let time = this.props.bettingProviderTime
        let game = this.props.game
        return time != null && game.cutOffTime <= time
    }

    isSubmitDisabled = () => {
        let { game, oddItem, depositedTokens } = this.props
        let isBetEmpty = oddItem.betAmount === 0 || oddItem === ''

        let totalBetAmount =
            parseInt(oddItem.betAmount, 10) + parseInt(game.betAmount, 10)
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
            console.log(
                'exceedsBetLimits',
                totalBetAmount,
                limit,
                totalBetAmount > limit
            )
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

    renderDropDownTeam = () => {
        let { oddItem, game, type } = this.props
        if (!oddItem) {
            return null
        }
        if (
            oddItem.betType === constants.ODDS_TYPE_SPREAD ||
            oddItem.betType === constants.ODDS_TYPE_MONEYLINE
        ) {
            let value = oddItem.selectedChoice
                ? oddItem.selectedChoice
                : constants.BET_CHOICE_TEAM1

            let homeTeamName = game.oracleInfo.team1
            let awayTeamName = game.oracleInfo.team2
            return (
                <DropDownMenu
                    className="mx-auto mt-3"
                    autoWidth={false}
                    style={{ width: '100%' }}
                    value={value}
                    onChange={this.onChangeTeamListener}
                >
                    <MenuItem
                        value={constants.BET_CHOICE_TEAM1}
                        primaryText={homeTeamName}
                    />
                    <MenuItem
                        value={constants.BET_CHOICE_TEAM2}
                        primaryText={awayTeamName}
                    />
                    {type === constants.ODDS_TYPE_MONEYLINE && (
                        <MenuItem
                            value={constants.BET_CHOICE_DRAW}
                            primaryText="Draw"
                        />
                    )}
                </DropDownMenu>
            )
        }
    }

    renderDropDownTotals = () => {
        let { oddItem } = this.props
        if (!oddItem) {
            return null
        }
        if (
            oddItem.betType === constants.ODDS_TYPE_TOTALS ||
            oddItem.betType === constants.ODDS_TYPE_TEAM_TOTALS
        ) {
            let value = oddItem.selectedChoice
                ? oddItem.selectedChoice
                : constants.BET_CHOICE_OVER
            return (
                <DropDownMenu
                    className="mx-auto mt-3"
                    autoWidth={false}
                    style={{ width: '100%' }}
                    value={value}
                    onChange={this.onChangeTeamTotalListener}
                >
                    <MenuItem
                        value={constants.BET_CHOICE_OVER}
                        primaryText="Over"
                    />
                    <MenuItem
                        value={constants.BET_CHOICE_UNDER}
                        primaryText="Under"
                    />
                </DropDownMenu>
            )
        }
    }

    render() {
        let { oddItem } = this.props
        let value = oddItem && oddItem.betAmount ? oddItem.betAmount : ''
        return (
            <div className="row mt-2">
                <div className="col-4">
                    <TextField
                        floatingLabelText="Bet Amount"
                        fullWidth={true}
                        type="number"
                        disabled={this.isDisabled()}
                        value={value}
                        onChange={this.onChangeListener}
                    />
                </div>
                <div className="col-4">
                    {this.renderDropDownTeam()}
                    {this.renderDropDownTotals()}
                </div>
                <div className="col-4 pt-1">
                    <p className="text-center key">MAX WIN</p>
                    <p className="text-center">{this.getMaxWin()} DBETs</p>
                </div>
                <div className="col-10">
                    <RaisedButton
                        secondary={true}
                        fullWidth={true}
                        label="Bet Now"
                        disabled={this.isSubmitDisabled()}
                        onClick={this.onSubmitListener}
                    />
                </div>
            </div>
        )
    }
}
