import React from 'react'
import { Card } from 'material-ui'
import GamesCardInner from './GamesCardInner'

const styles = require('../../../../Base/styles').styles()

export default function GamesCard({
    bettingProvider,
    sportsOracle,
    oddsMap,
    betNowButtonWrapper
}) {
    let { games, time } = bettingProvider

    // Merge the arrays into usable data
    // TODO: set this code in initialization sequence
    let gamesMap = Object.keys(games).map(gameId => {
        let game = games[gameId]
        game.id = gameId
        game.odds = oddsMap[game.id]
        game.oracleInfo = sportsOracle.games[game.oracleGameId]
        game.placedBets = bettingProvider.placedBets[game.id]
        return game
    })

    return (
        <section>
            <Card style={styles.card} className="mt-4 p-4">
                <div className="row">
                    <div className="col-12">
                        <h4 className="text-uppercase">Available Games</h4>
                        <hr />
                    </div>
                </div>

                <GamesCardInner
                    gamesMap={gamesMap}
                    bettingProviderTime={time}
                    sportsOracle={sportsOracle}
                    betNowButtonWrapper={betNowButtonWrapper}
                />
            </Card>
        </section>
    )
}
