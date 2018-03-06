import React, { Fragment } from 'react'

const constants = require('./../../../Constants')
const styles = require('../../../Base/styles').styles()
styles.button = {
    fontSize: 12,
    marginTop: 12.5,
    marginRight: 10,
    fontFamily: 'Lato',
    color: constants.COLOR_WHITE
}

/** Slots chips are merely DBETs that're deposited into the Slots Channel Manager contract
 and can be withdrawn at any time*/
export default function ChipToolbar({
    onWithdrawChipsListener,
    onGetChipsListener,
    chipsLabel
}) {
    return (
        <Fragment>
            <button
                className="btn btn-sm btn-primary hvr-fade float-right"
                style={styles.button}
            >
                Slots chips:
                <span className="ml-1">{chipsLabel}</span>
            </button>
            <button
                className="btn btn-sm btn-primary hvr-fade float-right text"
                style={styles.button}
                onClick={onWithdrawChipsListener}
            >
                Withdraw Chips
            </button>
            <button
                className="btn btn-sm btn-primary hvr-fade float-right text"
                style={styles.button}
                onClick={onGetChipsListener}
            >
                Get slots chips
            </button>
        </Fragment>
    )
}
