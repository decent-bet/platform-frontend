import React, { Fragment } from 'react'
import GamesCardItem from './GamesCardItem'

export default function GamesCardInner({
    gamesMap,
    bettingProviderTime,
    betNowButtonWrapper
}) {
    if (gamesMap.length < 1) {
        return (
            <div className="row">
                <div className="col-12 mt-4">
                    <p className="text-center">No games available</p>
                </div>
            </div>
        )
    } else {
        return gamesMap.map((game, index) => (
            <Fragment key={index}>
                <GamesCardItem
                    game={game}
                    index={index}
                    bettingProviderTime={bettingProviderTime}
                    betNowButtonWrapper={betNowButtonWrapper}
                />

                {index !== gamesMap.length - 1 && (
                    <div className="col-12">
                        <hr />
                    </div>
                )}
            </Fragment>
        ))
    }
}
