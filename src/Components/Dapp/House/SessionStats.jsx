import React, { Fragment } from 'react'
import { Card } from 'material-ui'
import Helper from '../../Helper'

const helper = new Helper()
const styles = require('../../Base/styles').styles()

/**
 * Prints all details of the House Funds
 * @param {HouseFunds} houseFunds House Funds 
 */
export default function SessionStats({ houseFunds }) {
    let totalFunds = houseFunds
        ? helper.formatEther(houseFunds.totalFunds)
        : '0'

    let totalCredits = houseFunds
        ? helper.formatEther(houseFunds.totalUserCredits)
        : '0'

    let totalProfit = houseFunds ? helper.formatEther(houseFunds.profit) : '0'

    return (
        <Fragment>
            <div className="col-4 text-center hvr-float">
                <Card style={styles.card} zDepth={4}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="header mb-2">
                                    Total House Funds
                                </h4>
                                <h4 className="stat mt-3">
                                    {totalFunds} DBETs
                                </h4>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="col-4 text-center hvr-float">
                <Card style={styles.card} zDepth={4}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="header mb-2">
                                    Total House Credits
                                </h4>
                                <h4 className="stat mt-3">
                                    {totalCredits} Credits
                                </h4>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="col-4 text-center hvr-float">
                <Card style={styles.card} zDepth={4}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="header mb-2">
                                    Profit Generated
                                </h4>
                                <h4 className="stat mt-3">
                                    {totalProfit} DBETs
                                </h4>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Fragment>
    )
}
