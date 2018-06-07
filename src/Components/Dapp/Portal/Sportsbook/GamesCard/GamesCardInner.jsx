import React, { Fragment } from 'react'
import GamesCardItem from './GamesCardItem'
import { Typography } from '@material-ui/core';

export default function GamesCardInner({
    gamesMap,
    bettingProviderTime,
    betNowButtonWrapper
}) {
    if (gamesMap.length < 1) {
        return (
            <Typography>
                No games available
            </Typography>
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
