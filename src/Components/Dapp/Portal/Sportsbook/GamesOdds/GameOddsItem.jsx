import React, { Fragment } from 'react'
import GameOddsItemInner from './GameOddsItemInner'

export default function GameOddsItem({
    game,
    betNowButtonWrapper,
    oddsArray,
    title
}) {
    let innerContent = null
    if (oddsArray) {
        // Each Row
        innerContent = oddsArray.map(odd => {
            return (
                <Fragment key={odd.id}>
                    <GameOddsItemInner game={game} oddsItem={odd} />

                    {// Setup the Buy Button
                    betNowButtonWrapper(odd, game)}
                </Fragment>
            )
        })
    }
    return (
        <div className="col-12 mt-3">
            <div className="row">
                <div className="col-3">
                    <p className="text-center mt-1 type">{title}</p>
                </div>
                <div className="col-9">{innerContent}</div>
            </div>
        </div>
    )
}
