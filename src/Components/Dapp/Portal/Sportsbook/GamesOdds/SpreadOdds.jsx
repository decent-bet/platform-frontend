import React, { Fragment } from 'react'
import { formatOddsNumber } from '../functions'

export default function SpreadOdds({ oddItem }) {
    return (
        <Fragment>
            <div className="col">
                <p className="key">Handicap</p>
                <p>{formatOddsNumber(oddItem.handicap)}</p>
            </div>
            <div className="col">
                <p className="key">Home</p>
                <p>{formatOddsNumber(oddItem.team1)}</p>
            </div>
            <div className="col">
                <p className="key">Away</p>
                <p>{formatOddsNumber(oddItem.team2)}</p>
            </div>
        </Fragment>
    )
}
