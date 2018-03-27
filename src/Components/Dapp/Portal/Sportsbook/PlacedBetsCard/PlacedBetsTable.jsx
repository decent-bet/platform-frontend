import React from 'react'
import { Card } from 'material-ui'
import TeamNames from '../TeamNames'
import PlacedBetsItem from './PlacedBetsItem'

const styles = require('../../../../Base/styles').styles()

export default function PlacedBetsTable({ game, onClaimBetListener }) {
    // Null protection
    if (!game) return null

    // Null protection
    let innerContent = []
    if (game.placedBets) {
        for (const betId in game.placedBets) {
            let betItem = game.placedBets[betId]
            innerContent.push(
                <PlacedBetsItem
                    key={betId}
                    gameItem={game}
                    betId={betId}
                    betItem={betItem}
                    onClaimBetListener={onClaimBetListener}
                />
            )
        }
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card style={styles.card} className="mt-4 p-4">
                    <div className="row info">
                        <div className="col-12">
                            <TeamNames game={game} />
                        </div>
                        <div className="col-12 mt-3">
                            <table className="table table-striped table-responsive">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Period</th>
                                        <th>Odds</th>
                                        <th>Choice</th>
                                        <th>Bet Amount</th>
                                        <th>Session</th>
                                        <th>Claimed</th>
                                        <th>Result</th>
                                        <th>Winnings</th>
                                        <th>Options</th>
                                    </tr>
                                </thead>
                                <tbody>{innerContent}</tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
