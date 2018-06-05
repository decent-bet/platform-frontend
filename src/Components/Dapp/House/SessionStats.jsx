import React, { Fragment } from 'react'
import { Card, CardHeader, CardContent } from '@material-ui/core'
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
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Total House Funds" />
                <CardContent>{totalFunds} DBETs</CardContent>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Total House Credits" />
                <CardContent>{totalCredits} Credits</CardContent>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title="Profit Generated" />
                <CardContent>{totalProfit} DBETs</CardContent>
            </Card>
        </Fragment>
    )
}
