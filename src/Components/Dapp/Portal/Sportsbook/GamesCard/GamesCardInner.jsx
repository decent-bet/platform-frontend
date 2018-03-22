import React, { Fragment } from 'react'
import GamesCardItem from './GamesCardItem'

export default function GamesCardInner({
    gamesMap,
    sportsOracle,
    gameProviderTime,
    depositedTokens,
    onSetBetAmountListener,
    onSetBetTeamListener,
    onSetTeamTotalListener,
    onOpenConfirmBetDialogListener
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
            <Fragment>
                <GamesCardItem
                    key={index}
                    game={game}
                    index={index}
                    depositedToken={depositedTokens}
                    onSetBetAmountListener={onSetBetAmountListener}
                    onSetBetTeamListener={onSetBetTeamListener}
                    onSetTeamTotalListener={onSetTeamTotalListener}
                    onOpenConfirmBetDialogListener={
                        onOpenConfirmBetDialogListener
                    }
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
