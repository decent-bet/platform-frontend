import React, { Fragment } from 'react'
import { formatOddsNumber } from '../functions'

export default function TeamTotalOdds({ oddItem, teamName }) {
    return (
        <Fragment>
            <div className="col">
                <p className="key">Team</p>
                <p>{teamName}</p>
            </div>
            <div className="col">
                <p className="key">Points</p>
                <p>{formatOddsNumber(oddItem.points)}</p>
            </div>
            <div className="col">
                <p className="key">Over</p>
                <p>{formatOddsNumber(oddItem.over)}</p>
            </div>
            <div className="col">
                <p className="key">Under</p>
                <p>{formatOddsNumber(oddItem.under)}</p>
            </div>
        </Fragment>
    )
}
