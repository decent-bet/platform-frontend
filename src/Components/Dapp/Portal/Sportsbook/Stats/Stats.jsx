import React from 'react'
import { Card, Button } from '@material-ui/core'
import Helper from '../../../../Helper'

const styles = require('../../../../Base/styles').styles()
const helper = new Helper()

export default function Stats({
    bettingProvider,
    onDepositTokensDialogOpen,
    onOpenWithdrawDialog
}) {
    let warning = null
    let formattedTokens = helper.formatEther(bettingProvider.depositedTokens)
    if (formattedTokens === '0.00') {
        warning = (
            <div className="col-12 mt-4">
                <p className="text-danger text-center text-uppercase small">
                    Please deposit tokens into the sportsbook contract before
                    placing any bets
                </p>
            </div>
        )
    }
    return (
        <section>
            <Card style={styles.card} className="mt-4 p-4">
                <div className="row stats">
                    <div className="col-12 mb-4">
                        <h4 className="text-uppercase text-center">
                            Sportsbook Stats
                        </h4>
                    </div>
                    <div className="col-6">
                        <p className="key">Current Session</p>
                        <p>{bettingProvider.currentSession.toString()}</p>
                    </div>
                    <div className="col-6">
                        <p className="key text-center">Your Session Balance</p>
                        <p>{formattedTokens} DBETs</p>
                        <Button
                            variant="raised"
                            primary={true}
                            fullWidth={true}
                            onClick={onDepositTokensDialogOpen}
                            className="mx-auto pb-2"
                        >
                            Deposit
                        </Button>
                        <Button
                            variant="raised"
                            primary={true}
                            fullWidth={true}
                            onClick={onOpenWithdrawDialog}
                            className="mx-auto"
                        >
                            Withdraw
                        </Button>
                    </div>
                    <div className="col-6">
                        <p className="key">Sportsbook balance</p>
                        <p>{helper.commafy(bettingProvider.balance)} DBETs</p>
                    </div>
                    {warning}
                </div>
            </Card>
        </section>
    )
}
