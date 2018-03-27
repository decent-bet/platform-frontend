import React from 'react'
import { Card } from 'material-ui'
import PlacedBetsTable from './PlacedBetsTable'

const styles = require('../../../../Base/styles').styles()

export default function PlacedBetsCard({
    bettingProvider,
    sportsOracle,
    gamesMap,
    onClaimBetListener
}) {
    // Get all the games in the map that have bets
    let gamesWithBets = gamesMap.filter(value => value.placedBets)

    let innerContent
    if (gamesWithBets.length < 1) {
        // Placeholder for empty array
        innerContent = <p className="text-center mt-4">No bets placed</p>
    } else {
        // If array contains bets, print the rows
        innerContent = gamesWithBets.map(game => (
            <PlacedBetsTable
                game={game}
                key={game.id}
                onClaimBetListener={onClaimBetListener}
            />
        ))
    }
    return (
        <section className="mt-4">
            <Card style={styles.card} className="mt-4 p-4">
                <div className="row">
                    <div className="col-12">
                        <h4 className="text-uppercase">Bets placed</h4>
                        <hr />
                    </div>
                </div>

                <div className="col-12">{innerContent}</div>
            </Card>
        </section>
    )
}
