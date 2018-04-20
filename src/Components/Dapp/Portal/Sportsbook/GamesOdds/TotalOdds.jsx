import React, { Fragment } from 'react'
import { formatOddsNumber } from '../functions'

export default function TotalOdds({ oddsItem }) {
    return (
        <Fragment>
            <div className="col">
                <p className="key">Points</p>
                <p>{formatOddsNumber(oddsItem.points)}</p>
            </div>
            <div className="col">
                <p className="key">Over</p>
                <p>{formatOddsNumber(oddsItem.over)}</p>
            </div>
            <div className="col">
                <p className="key">Under</p>
                <p>{formatOddsNumber(oddsItem.under)}</p>
            </div>
        </Fragment>
    )
}
