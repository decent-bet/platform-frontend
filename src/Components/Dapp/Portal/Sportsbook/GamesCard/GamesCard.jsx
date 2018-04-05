import React from 'react'
import { Card } from 'material-ui'
import GamesCardInner from './GamesCardInner'

const styles = require('../../../../Base/styles').styles()

export default function GamesCard({
    bettingProvider,
    betNowButtonWrapper,
    gamesMap
}) {
    let { time } = bettingProvider
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
                    betNowButtonWrapper={betNowButtonWrapper}
                />
            </Card>
        </section>
    )
}
