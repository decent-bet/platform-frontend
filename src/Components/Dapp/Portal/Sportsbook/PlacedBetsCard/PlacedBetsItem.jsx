import React, { Component } from 'react'
import { RaisedButton } from 'material-ui'
import {
    isGameOutcomeAvailable,
    getPeriodDescription,
    getFormattedOdds,
    getFormattedBetChoice,
    getGameOutcome,
    getWinnings
} from '../functions'

export default class PlacedBetsItem extends Component {
    onClickListener = () => {
        let { onClaimBetListener, gameItem, betId } = this.props
        onClaimBetListener(gameItem, betId)
    }
    render() {
        let { gameItem, betItem, betId } = this.props
        let oddsObj = gameItem.odds ? gameItem.odds[betItem.oddsId] : null

        // Null protection
        if (!oddsObj) return null

        let winnings = getWinnings(gameItem, oddsObj, betItem)
        return (
            <tr>
                <th scope="row">{betId}</th>
                <td>{getPeriodDescription(gameItem, oddsObj.period)}</td>
                <td>{getFormattedOdds(oddsObj)}</td>
                <td>{getFormattedBetChoice(gameItem, betItem.choice)}</td>
                <td>{betItem.amount} DBETs</td>
                <td>{betItem.session}</td>
                <td>{betItem.claimed ? 'Claimed' : 'Unclaimed'}</td>
                <td>{getGameOutcome(gameItem, oddsObj.period)}</td>
                <td>{winnings} DBETs</td>
                <td>
                    <RaisedButton
                        secondary={true}
                        label="Claim Winnings"
                        disabled={
                            !isGameOutcomeAvailable(gameItem, oddsObj.period) ||
                            winnings === 0 ||
                            betItem.claimed
                        }
                        onClick={this.onClickListener}
                    />
                </td>
            </tr>
        )
    }
}
