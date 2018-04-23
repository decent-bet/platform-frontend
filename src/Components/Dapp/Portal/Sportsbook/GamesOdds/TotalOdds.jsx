import React, { Fragment } from 'react'
import { formatOddsNumber } from '../functions'

export default function TotalOdds({ oddItem }) {
    return (
        <Fragment>
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
