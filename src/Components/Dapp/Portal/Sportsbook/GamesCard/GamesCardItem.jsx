import React from 'react'
import BettingStatus from './BettingStatus'
import TeamNames from './TeamNames'
import GameOdds from '../GamesOdds'
import BetLimits from './BetLimits'
import BetInformation from './BetInformation'

function gameStartTime(oracleGame) {
    if (oracleGame) {
        let date = oracleGame.startTime * 1000
        return 'Start time:' + new Date(date).toLocaleString()
    } else {
        return 'Start time: Loading..'
    }
}

function leagueName(oracleGame) {
    if (oracleGame) {
        return oracleGame.league
    } else {
        return 'loading...'
    }
}

export default function GamesCardItem({
    game,
    index,
    depositedTokens,
    gameProviderTime,
    onSetBetAmountListener,
    onSetBetTeamListener,
    onSetTeamTotalListener,
    onOpenConfirmBetDialogListener
}) {
    let cutoffTime = new Date(game.cutOffTime * 1000).toLocaleString()
    return (
        <div className="row">
            <div className="col-12">
                <div className="row">
                    <div className="col-11">
                        <TeamNames game={game} />
                    </div>
                    <div className="col-1">
                        <small className="float-right">
                            #{game.oracleGameId}
                        </small>
                    </div>
                    <div className="col-12">
                        <BettingStatus
                            game={game}
                            gameProviderTime={gameProviderTime}
                        />
                        <br />
                        <small>Cut-off time: {cutoffTime}</small>
                        <br />
                        <small>{gameStartTime(game.oracleInfo)}</small>
                        <small className="float-right">
                            {leagueName(game.oracleInfo)}
                        </small>
                    </div>
                </div>
            </div>
            <GameOdds
                game={game}
                bettingProviderTime={gameProviderTime}
                depositedTokens={depositedTokens}
                onSetBetAmountListener={onSetBetAmountListener}
                onSetBetTeamListener={onSetBetTeamListener}
                onSetTeamTotalListener={onSetTeamTotalListener}
                onOpenConfirmBetDialogListener={onOpenConfirmBetDialogListener}
            />
            <div className="col-12">
                <hr />
                <p className="mt-2">Bet Limits</p>
                <BetLimits game={game} />
            </div>
            <div className="col-12">
                <hr />
                <p className="mt-2">Bet Information</p>
                <BetInformation
                    game={game}
                />
            </div>
        </div>
    )
}
