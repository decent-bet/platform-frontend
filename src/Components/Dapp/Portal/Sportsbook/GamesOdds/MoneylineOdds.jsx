import React, { Fragment } from 'react'
import { formatOddsNumber } from '../functions'

export default function MoneylineOdds({ oddItem }) {
    return (
        <Fragment>
            <div className="col">
                <p className="key">Home</p>
                <p>{formatOddsNumber(oddItem.team1)}</p>
            </div>
            <div className="col">
                <p className="key">Away</p>
                <p>{formatOddsNumber(oddItem.team2)}</p>
            </div>
            <div className="col">
                <p className="key">Draw</p>
                <p>{formatOddsNumber(oddItem.draw)}</p>
            </div>
        </Fragment>
    )
}
